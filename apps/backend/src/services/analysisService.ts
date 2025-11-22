import {
  type ChapterSummary,
  ChapterSummarySchema,
  type MasterStoryDocument,
  MasterStoryDocumentSchema,
  type Score,
  scoreSchema,
} from "@story-generation/types";
import type { Request, Response } from "express";
import pLimit from "p-limit";
import type { AnalysisJob, ChapterData } from "@/generated/prisma/client.js";
import { analysisQueue } from "@/lib/queue.js";
import { createAnalyzeChapterPrompt } from "@/prompts/analyzeChapterPrompt.js";
import { prisma } from "@/src/lib/prisma.js";
import { createMasterStoryDocPrompt } from "@/src/prompts/masterPrompt.js";
import { judgeMasterDocumentPrompt } from "@/src/prompts/scorePrompt.js";
import { createLangChainClient } from "@/src/services/langchainService.js";

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
 * Retry helper with exponential backoff
 */
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 2,
  initialDelay = 1000,
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        const delay = initialDelay * 2 ** attempt;
        console.warn(
          `Attempt ${attempt + 1} failed, retrying in ${delay}ms...`,
          lastError.message,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
};

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

/**
 * Helper function to judge a master document.
 */
const judgeNewMasterDocument = async (
  chapterData: ChapterData,
  masterStoryDocument: MasterStoryDocument,
): Promise<Score> => {
  const prompt = judgeMasterDocumentPrompt(
    chapterData.content,
    masterStoryDocument,
  );

  const response = await langChainClient
    .withStructuredOutput(scoreSchema)
    .invoke(prompt);

  return response;
};

const judgeChapterAnalysis = async (
  chapterData: ChapterData,
  chapterAnalysis: ChapterSummary,
): Promise<Score> => {
  const prompt = judgeChapterAnalysisPrompt(
    chapterData.content,
    chapterAnalysis,
  );

  const response = await langChainClient
    .withStructuredOutput(scoreSchema)
    .invoke(prompt);

  return response;
};

const analyzeSingleChapterIndirectly = async (
  chapterData: ChapterData,
  storyAnalysisId: string,
): Promise<ChapterSummary> => {
  // Check if a ChapterAnalysis already exists for this chapter and story analysis
  const existingAnalysis = await prisma.chapterAnalysis.findFirst({
    where: {
      chapterDataId: chapterData.id,
      storyAnalysisId: storyAnalysisId,
    },
  });

  if (existingAnalysis?.analysis) {
    console.log(`Using existing analysis for chapter ${chapterData.number}`);
    return existingAnalysis.analysis as ChapterSummary;
  }

  console.log(`Analyzing chapter ${chapterData.number}`);
  const prompt = createAnalyzeChapterPrompt(chapterData);
  const chapterSummary: ChapterSummary = await retryWithBackoff(() =>
    langChainClient.withStructuredOutput(ChapterSummarySchema).invoke(prompt),
  );

  // Create a new ChapterAnalysis record
  await prisma.chapterAnalysis.create({
    data: {
      analysis: chapterSummary,
      chapterData: {
        connect: { id: chapterData.id },
      },
      storyAnalysis: {
        connect: { id: storyAnalysisId },
      },
    },
  });

  console.log(`Finished analyzing chapter ${chapterData.number}`);

  return chapterSummary;
};

const analyzeChapterIndirectly = async (
  job: AnalysisJob & { storyData: { chapters: ChapterData[] } },
): Promise<MasterStoryDocument> => {
  try {
    // Find or create the StoryAnalysis record
    let storyAnalysis = await prisma.storyAnalysis.findFirst({
      where: {
        id: job.storyDataId,
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

    const tasks: Promise<ChapterSummary>[] = chaptersToAnalyze.map((chapter) =>
      limit<ChapterSummary>(() =>
        analyzeSingleChapterIndirectly(chapter, currentAnalysisId),
      ),
    );

    const chapterSummaries: ChapterSummary[] = await Promise.all(tasks);

    const sortedChapterSummaries = chapterSummaries.sort(
      (a, b) => a.chapterNumber - b.chapterNumber,
    );

    const masterDocPrompt = await createMasterStoryDocPrompt(
      sortedChapterSummaries,
    );

    const rawMasterDocument = await retryWithBackoff(() =>
      langChainClient
        .withStructuredOutput(MasterStoryDocumentSchema)
        .invoke(masterDocPrompt),
    );

    const masterStoryDocument =
      MasterStoryDocumentSchema.parse(rawMasterDocument);

    await prisma.analysisJob.update({
      where: { id: job.id },
      data: {
        masterDocument: masterStoryDocument,
      },
    });

    return masterStoryDocument;
  } catch (error) {
    console.error("Error in analyzeChapterIndirectly:", error);
    throw new Error(
      `Failed to analyze chapter indirectly: ${
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
