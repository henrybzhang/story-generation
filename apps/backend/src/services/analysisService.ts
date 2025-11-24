import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { AIMessage } from "@langchain/core/messages";
import {
  type ChapterAnalysis,
  ChapterAnalysisSchema,
  type MasterStoryDocument,
  MasterStoryDocumentSchema,
} from "@story-generation/types";
import type { Request, Response } from "express";
import pLimit from "p-limit";
import type z from "zod";
import type { AnalysisJob, ChapterData } from "@/generated/prisma/client.js";
import { analysisQueue } from "@/lib/queue.js";
import { createAnalyzeChapterPrompt } from "@/prompts/analyzeChapterPrompt.js";
import { prisma } from "@/src/lib/prisma.js";
import { createMasterStoryDocPrompt } from "@/src/prompts/masterPrompt.js";
import { createLangChainClient } from "@/src/services/langchainService.js";
import {
  generateChapterAnalysisTestReport,
  runChapterAnalysisTests,
} from "../test/testChapterAnalysis";
import { log } from "../utils/logging";

if (!process.env.MASTER_DOCUMENT_PROMPT_VERSION) {
  throw new Error(
    "MASTER_DOCUMENT_PROMPT_VERSION is not set in environment variables",
  );
}

if (!process.env.STORY_ANALYSIS_PROMPT_VERSION) {
  throw new Error(
    "STORY_ANALYSIS_PROMPT_VERSION is not set in environment variables",
  );
}

if (!process.env.MODEL_NAME) {
  throw new Error("MODEL_NAME is not set in environment variables");
}

const MASTER_DOCUMENT_PROMPT_VERSION = parseInt(
  process.env.MASTER_DOCUMENT_PROMPT_VERSION,
  10,
);
const STORY_ANALYSIS_PROMPT_VERSION = parseInt(
  process.env.STORY_ANALYSIS_PROMPT_VERSION,
  10,
);

const MODEL_NAME = process.env.MODEL_NAME;

const langChainClient = createLangChainClient();

/**
 * Creates an AnalysisJob record.
 * This function *sets up* the job but does not perform the analysis.
 *
 * @param storyId The ID of the story to analyze.
 * @returns The newly created AnalysisJob.
 */
const processAnalysisJob = async (
  storyId: string,
  method: string,
  lastChapterNumber: number,
): Promise<AnalysisJob> => {
  const newJob = await prisma.analysisJob.create({
    data: {
      method,
      status: "PENDING",
      promptVersion: MASTER_DOCUMENT_PROMPT_VERSION,
      modelName: MODEL_NAME,
      storyData: {
        connect: { id: storyId },
      },
      lastChapterNumber,
    },
  });

  await analysisQueue.add("story-analysis", {
    jobId: newJob.id,
  });

  return newJob;
};

// /**
//  * Helper function to judge a master document.
//  */
// const judgeNewMasterDocument = async (
//   chapterData: ChapterData,
//   masterStoryDocument: MasterStoryDocument,
// ): Promise<Score> => {
//   const prompt = judgeMasterDocumentPrompt(
//     chapterData.content,
//     masterStoryDocument,
//   );

//   const response = await langChainClient
//     .withStructuredOutput(scoreSchema)
//     .invoke(prompt);

//   return response;
// };

// const judgeChapterAnalysis = async (
//   chapterData: ChapterData,
//   chapterAnalysis: ChapterSummary,
// ): Promise<Score> => {
//   const prompt = judgeChapterAnalysisPrompt(
//     chapterData.content,
//     chapterAnalysis,
//   );

//   const response = await langChainClient
//     .withStructuredOutput(scoreSchema)
//     .invoke(prompt);

//   return response;
// };

/**
 * Generic helper to generate structured output and log raw LLM output on parse failure.
 */
const generateAndParseSchema = async <T>(
  prompt: string,
  chapterNumber: number,
  schema: z.ZodType<T>,
  toolName: string,
  toolDescription: string,
): Promise<T> => {
  const modelWithTool = langChainClient.bindTools(
    [
      {
        name: toolName,
        description: toolDescription,
        schema: schema,
      },
    ],
    { tool_choice: toolName },
  );

  let rawResponse: AIMessage;

  // 2. Get Raw Response (Network Layer)
  try {
    // We invoke the model directly to get the raw BaseMessage first
    rawResponse = await modelWithTool.invoke(prompt);
  } catch (networkError) {
    console.error(`❌ NETWORK/GEN FAILED for Chapter ${chapterNumber}`);
    throw networkError;
  }

  // Save raw response to disk
  try {
    const logsDir = join(process.cwd(), "logs");
    await mkdir(logsDir, { recursive: true });

    const filename = `${toolName}-${chapterNumber}.json`;
    const filepath = join(logsDir, filename);

    const rawContent = rawResponse.tool_calls?.[0]?.args || rawResponse.content;
    const contentToSave =
      typeof rawContent === "string"
        ? rawContent
        : JSON.stringify(rawContent, null, 2);

    await writeFile(filepath, contentToSave, "utf-8");

    // Save full raw response if available
    if (rawResponse) {
      const reasoningFilename = `${toolName}-${chapterNumber}-RawResponse.json`;
      const reasoningFilepath = join(logsDir, reasoningFilename);

      // Convert AIMessage to a serializable plain object
      const serializableResponse = {
        content: rawResponse.content,
        tool_calls: rawResponse.tool_calls,
        response_metadata: rawResponse.response_metadata,
        usage_metadata: rawResponse.usage_metadata,
        name: rawResponse.name,
        additional_kwargs: rawResponse.additional_kwargs,
        text: rawResponse.text,
      };

      await writeFile(
        reasoningFilepath,
        JSON.stringify(serializableResponse, null, 2),
        "utf-8",
      );
    }
  } catch (fileError) {
    console.error(`⚠️ Failed to save raw response to disk: ${fileError}`);
    // Don't throw - this is a non-critical operation
  }

  // 3. Parse Response (Validation Layer)
  const toolCall = rawResponse.tool_calls?.[0];

  if (!toolCall) {
    throw new Error("LLM did not return a tool call.");
  }

  try {
    // Handle case where LangChain returns args as string vs object
    const argsToParse =
      typeof toolCall.args === "string"
        ? JSON.parse(toolCall.args)
        : toolCall.args;

    // Zod Validation
    return schema.parse(argsToParse);
  } catch (parseError) {
    console.error(
      `❌ PARSING ${toolName} FAILED for Chapter ${chapterNumber}: ${parseError}`,
    );
    throw parseError;
  }
};

const analyzeSingleChapterIndirectly = async (
  chapterData: ChapterData,
  storyAnalysisId: string,
): Promise<ChapterAnalysis> => {
  // 1. Check DB for existing analysis
  const existingAnalysis = await prisma.chapterAnalysis.findFirst({
    where: {
      chapterDataId: chapterData.id,
      storyAnalysisId: storyAnalysisId,
    },
  });

  if (existingAnalysis?.analysis) {
    log(
      storyAnalysisId,
      `Using existing analysis for chapter ${chapterData.number}`,
    );
    return existingAnalysis.analysis as ChapterAnalysis;
  }

  log(storyAnalysisId, `Analyzing chapter ${chapterData.number}...`);

  const prompt = createAnalyzeChapterPrompt(chapterData);

  const chapterSummary = await generateAndParseSchema(
    prompt,
    chapterData.number,
    ChapterAnalysisSchema,
    "generate_chapter_analysis",
    "Generates a structured analysis of a story chapter.",
  );

  // 4. Save to DB
  await prisma.chapterAnalysis.create({
    data: {
      analysis: chapterSummary,
      chapterData: { connect: { id: chapterData.id } },
      storyAnalysis: { connect: { id: storyAnalysisId } },
    },
  });

  log(storyAnalysisId, `Finished analyzing chapter ${chapterData.number}`);

  const testResult = runChapterAnalysisTests(
    chapterData.number,
    chapterSummary,
  );
  if (!testResult.overallPass) {
    const report = generateChapterAnalysisTestReport(testResult);
    log(
      storyAnalysisId,
      `Test results for chapter ${chapterData.number}: ${report}`,
    );
  }

  return chapterSummary;
};

const analyzeChapterIndirectly = async (
  job: AnalysisJob & { storyData: { chapters: ChapterData[] } },
): Promise<MasterStoryDocument> => {
  try {
    // Find or create the StoryAnalysis record
    let storyAnalysis = await prisma.storyAnalysis.findFirst({
      where: {
        storyDataId: job.storyDataId,
        promptVersion: STORY_ANALYSIS_PROMPT_VERSION,
        modelName: job.modelName,
      },
    });

    if (!storyAnalysis) {
      storyAnalysis = await prisma.storyAnalysis.create({
        data: {
          promptVersion: STORY_ANALYSIS_PROMPT_VERSION,
          modelName: job.modelName,
          storyData: {
            connect: { id: job.storyDataId },
          },
        },
      });
    }

    if (!storyAnalysis)
      throw new Error("Failed to retrieve or create StoryAnalysis record");
    const currentAnalysisId = storyAnalysis.id;

    const chaptersToAnalyze = job.storyData.chapters.filter(
      (chapter) => chapter.number <= job.lastChapterNumber,
    );

    const limit = pLimit(8);

    const tasks: Promise<ChapterAnalysis>[] = chaptersToAnalyze.map((chapter) =>
      limit(() => analyzeSingleChapterIndirectly(chapter, currentAnalysisId)),
    );

    const chapterSummaries: ChapterAnalysis[] = await Promise.all(tasks);

    const sortedChapterSummaries = chapterSummaries.sort(
      (a, b) => a.chapterNumber - b.chapterNumber,
    );

    const masterDocPrompt = await createMasterStoryDocPrompt(
      sortedChapterSummaries,
    );

    const masterStoryDocument = await generateAndParseSchema(
      masterDocPrompt,
      job.lastChapterNumber,
      MasterStoryDocumentSchema,
      "generate_master_story_document",
      "Generates a comprehensive master story document based on chapter analyses.",
    );

    await prisma.analysisJob.update({
      where: { id: job.id },
      data: {
        masterDocument: masterStoryDocument,
      },
    });

    return masterStoryDocument;
  } catch (error) {
    throw new Error(
      `Failed to analyze indirectly: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
};

/**
 * Stubbed function for file analysis (Not Implemented)
 */
const analyzeFiles = async (req: Request, res: Response) => {
  res.status(500).json({ error: "Not implemented" });
};

/**
 * Stubbed function for link analysis (Not Implemented)
 */
const analyzeLink = async (req: Request, res: Response) => {
  res.status(500).json({ error: "Not implemented" });
};

export {
  analyzeFiles,
  analyzeLink,
  analyzeChapterIndirectly,
  processAnalysisJob,
};
