import {
  type ChapterOutline,
  type ContextualChapterAnalysisData,
  type ContextualChapterPartialAnalysis,
  contextualAnalysisSchema,
  type IndividualChapterAnalysis,
  type IndividualChapterAnalysisData,
  individualAnalysisSchema,
  type MasterStoryDocument,
  MasterStoryDocumentSchema,
  type Score,
  scoreSchema,
} from "@story-generation/types";
import type { Request, Response } from "express";
import type { AnalysisJob, ChapterData } from "@/generated/prisma/client.js";
import { prisma } from "@/src/lib/prisma.js";
import {
  createContextualAnalysisPrompt,
  createIndividualAnalysisPrompt,
  createNextMasterDocFromOutlinePrompt,
} from "@/src/schemas/directPrompt.js";
import {
  scorePrompt,
  scorePromptWithMasterStoryDocument,
} from "@/src/schemas/scoreSchema.js";
import { createLangChainClient } from "@/src/services/langchainService.js";
import { analysisQueue } from "../lib/queue.js";

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
 * Helper function to calculate the score for a given chapter.
 * This remains unchanged as it already operates on a single chapter.
 */
const calculateScore = async (
  chapterData: ChapterData,
  chapterOutline: ChapterOutline,
  masterStoryDocument?: MasterStoryDocument,
): Promise<Score> => {
  let prompt: string;
  if (masterStoryDocument) {
    prompt = scorePromptWithMasterStoryDocument(
      chapterData.content,
      chapterOutline,
      masterStoryDocument,
    );
  } else {
    prompt = scorePrompt(chapterData.content, chapterOutline);
  }

  const response = await langChainClient
    .withStructuredOutput(scoreSchema)
    .invoke(prompt);

  return response;
};

/**
 * Analyzes a single chapter without context.
 * This logic is extracted from the old `analyzeIndividually` loop.
 */
const analyzeChapterIndividually = async (
  chapterData: ChapterData,
): Promise<IndividualChapterAnalysisData> => {
  try {
    const prompt = createIndividualAnalysisPrompt(chapterData);

    // 1. Get the Individual analysis
    const analysis: IndividualChapterAnalysis = await langChainClient
      .withStructuredOutput(individualAnalysisSchema)
      .invoke(prompt);

    // 2. Get the score
    const score = await calculateScore(chapterData, analysis.chapterOutline);

    // 3. Combine and return
    return {
      analysis,
      number: chapterData.number,
      score,
    };
  } catch (error) {
    console.error("Error in analyzeChapterIndividually:", error);
    throw new Error(
      `Failed to process chapter individually: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
};

/**
 * Analyzes a single chapter with context from the previous master document.
 * This logic is extracted from the old `analyzeWithContext` loop.
 *
 * IMPORTANT: This function now returns the *new* masterStoryDocument
 * alongside the score, so the client can use it for the *next* chapter.
 */
const analyzeChapterWithContext = async (
  chapterData: ChapterData,
  masterStoryDocument?: MasterStoryDocument,
): Promise<ContextualChapterAnalysisData> => {
  try {
    // --- Call 1: Contextual Analysis (Blocking) ---
    const prompt = createContextualAnalysisPrompt(
      chapterData,
      masterStoryDocument,
    );
    const response: ContextualChapterPartialAnalysis = await langChainClient
      .withStructuredOutput(contextualAnalysisSchema)
      .invoke(prompt);

    // --- Prepare Parallel Calls ---
    const masterDocPrompt = await createNextMasterDocFromOutlinePrompt(
      response.chapterOutline,
      masterStoryDocument,
    );

    const scorePromise = calculateScore(chapterData, response.chapterOutline);
    const masterDocPromise = langChainClient
      .withStructuredOutput(MasterStoryDocumentSchema)
      .invoke(masterDocPrompt);

    // --- Calls 2 & 3: Run in Parallel ---
    const [score, newMasterDocument] = await Promise.all([
      scorePromise,
      masterDocPromise,
    ]);

    // --- Return Results ---
    // The client will receive this and must send `newMasterDocument`
    // with the *next* chapter's request.
    return {
      analysis: newMasterDocument,
      number: chapterData.number,
      score,
    };
  } catch (error) {
    console.error("Error in analyzeChapterWithContext:", error);
    throw new Error(
      `Failed to process chapter with context: ${
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
  // Exporting the new single-chapter helpers for potential internal use or testing
  analyzeChapterIndividually,
  analyzeChapterWithContext,
  processAnalysisJob,
};
