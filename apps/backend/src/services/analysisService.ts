import {
  type ChapterSummary,
  ChapterSummarySchema,
  type DirectChapterAnalysisData,
  type IndirectChapterAnalysisData,
  type MasterStoryDocument,
  MasterStoryDocumentSchema,
  type Score,
  scoreSchema,
} from "@story-generation/types";
import type { Request, Response } from "express";
import type { AnalysisJob, ChapterData } from "@/generated/prisma/client.js";
import { prisma } from "@/src/lib/prisma.js";
import { createNextMasterDocDirectlyPrompt } from "@/src/schemas/directPrompt.js";
import { judgeMasterDocumentPrompt } from "@/src/schemas/scoreSchema.js";
import { createLangChainClient } from "@/src/services/langchainService.js";
import { analysisQueue } from "../lib/queue.js";
import {
  createIndirectAnalysisPrompt,
  updateMasterDocFromAnalysisPrompt,
} from "../schemas/indirectPrompt.js";

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
): Promise<AnalysisJob> => {
  const newJob = await prisma.analysisJob.create({
    data: {
      method,
      status: "PENDING",
      storyData: {
        connect: { id: storyId },
      },
    },
  });

  await analysisQueue.add("story-analysis", {
    jobId: newJob.id, // Pass the DB job ID to the worker
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

const analyzeChapterIndirectly = async (
  chapterData: ChapterData,
  masterStoryDocument?: MasterStoryDocument,
): Promise<IndirectChapterAnalysisData> => {
  try {
    const prompt = createIndirectAnalysisPrompt(chapterData);
    const chapterSummary: ChapterSummary = await langChainClient
      .withStructuredOutput(ChapterSummarySchema)
      .invoke(prompt);

    const masterDocPrompt = await updateMasterDocFromAnalysisPrompt(
      chapterSummary,
      masterStoryDocument,
    );

    const newMasterDocument = await langChainClient
      .withStructuredOutput(MasterStoryDocumentSchema)
      .invoke(masterDocPrompt);

    // const score = await judgeNewMasterDocument(chapterData, newMasterDocument);
    const score = {
      value: 100,
      rationale: "TBD",
    };

    return {
      analysis: {
        masterStoryDocument: newMasterDocument,
        chapterSummary: chapterSummary,
      },
      number: chapterData.number,
      score,
    };
  } catch (error) {
    console.error("Error in analyzeChapterIndirectly:", error);
    throw new Error(
      `Failed to analyze chapter indirectly: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
};

const analyzeChapterDirectly = async (
  chapterData: ChapterData,
  masterStoryDocument?: MasterStoryDocument,
): Promise<DirectChapterAnalysisData> => {
  try {
    const masterDocPrompt = createNextMasterDocDirectlyPrompt(
      chapterData,
      masterStoryDocument,
    );

    const newMasterDocument = await langChainClient
      .withStructuredOutput(MasterStoryDocumentSchema)
      .invoke(masterDocPrompt);

    // const score = await judgeNewMasterDocument(chapterData, newMasterDocument);
    const score = {
      value: 100,
      rationale: "TBD",
    };

    return {
      analysis: {
        masterStoryDocument: newMasterDocument,
      },
      number: chapterData.number,
      score,
    };
  } catch (error) {
    console.error("Error in analyzeChapterDirectly:", error);
    throw new Error(
      `Failed to analyze chapter directly: ${
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
  analyzeChapterDirectly,
  processAnalysisJob,
};
