import type { Request, Response } from "express";
import {
  scorePrompt,
  scorePromptWithMasterStoryDocument,
  scoreSchema,
} from "@/src/lib/scoreSchema.js";
import {
  type ChapterOutline,
  type ContextualStoryAnalysis,
  contextualAnalysisSchema,
  createContextualAnalysisPrompt,
  createNextMasterDocFromOutlinePrompt,
  createSequentialAnalysisPrompt,
  type MasterStoryDocument,
  MasterStoryDocumentSchema,
  type SequentialStoryAnalysis,
  sequentialAnalysisSchema,
} from "../../lib/analysisSchema.js";
import type {
  AnalysisMethod,
  AnalysisRequest,
  AnalysisResult,
  ChapterData,
  ContextualStoryAnalysisWithScore,
  SequentialStoryAnalysisWithScore,
} from "../../types/storyAnalysis.js";
import { createLangChainClient } from "../../utils/langchain.js";

// Initialize LangChain client
const langChainClient = createLangChainClient();

/**
 * Helper function to analyze content with all available methods
 */
const analyzeWithAllMethods = async (storyData: Map<string, ChapterData>) => {
  const methods: AnalysisMethod[] = ["sequential", "contextual"];
  const results: Record<string, any> = {};
  const errors: string[] = [];

  // Run all methods in parallel
  await Promise.all(
    methods.map(async (method) => {
      try {
        const result = await analyzeStory(storyData, method);
        if (result.success) {
          results[method] = result.data;
        } else {
          errors.push(`${method}: ${result.error}`);
          results[method] = { error: result.error };
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";
        errors.push(`${method}: ${errorMsg}`);
        results[method] = { error: errorMsg };
      }
    }),
  );

  return { results, errors };
};

const calculateScore = async (
  chapterData: ChapterData,
  chapterOutline: ChapterOutline,
  masterStoryDocument?: MasterStoryDocument,
) => {
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
 * Analyze text input with all available methods
 */
const analyzeText = async (req: Request, res: Response) => {
  try {
    const { storyData } = req.body as AnalysisRequest;

    if (!storyData || storyData.size === 0) {
      return res.status(400).json({ error: "Story data is required" });
    }

    const { results, errors } = await analyzeWithAllMethods(
      new Map(Object.entries(storyData)),
    );

    if (errors.length > 0) {
      console.warn("Some analyses completed with errors:", errors);
    }

    res.json({
      success: true,
      data: results,
      methods: Object.keys(results),
      ...(errors.length > 0 && { warnings: errors }),
    });
  } catch (error) {
    console.error("Error in analyzeText:", error);
    res.status(500).json({
      success: false,
      error: "Failed to analyze text",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Analyze uploaded files with all available methods
 */
const analyzeFiles = async (req: Request, res: Response) => {
  res.status(500).json({ error: "Not implemented" });
};

const analyzeLink = async (req: Request, res: Response) => {
  res.status(500).json({ error: "Not implemented" });
};

/**
 * Main analysis function that handles the analysis based on the specified method
 */
const analyzeStory = async (
  storyData: Map<string, ChapterData>,
  method: AnalysisMethod = "contextual",
): Promise<
  AnalysisResult<
    SequentialStoryAnalysisWithScore | ContextualStoryAnalysisWithScore
  >
> => {
  switch (method) {
    case "sequential":
      return analyzeSequentially(storyData);
    case "contextual":
      return analyzeWithContext(storyData);
    default:
      return { success: false, error: "Invalid analysis method" };
  }
};

/**
 * Method 2: Analyze chapters sequentially without context from previous chapters
 */
const analyzeSequentially = async (
  storyData: Map<string, ChapterData>,
): Promise<
  AnalysisResult<Record<string, SequentialStoryAnalysisWithScore>>
> => {
  const results: Record<string, SequentialStoryAnalysis> = {};

  const analysisPromises = Array.from(storyData.entries()).map(
    async ([chapterNum, content]) => {
      try {
        const prompt = createSequentialAnalysisPrompt(content);

        const response: SequentialStoryAnalysis = await langChainClient
          .withStructuredOutput(sequentialAnalysisSchema)
          .invoke(prompt);

        const score = await calculateScore(content, response.chapterOutline);

        // Return the key and data for this chapter
        return {
          chapterKey: `chapter_${chapterNum}`,
          data: {
            ...response,
            ...score,
          },
        };
      } catch (error) {
        console.error(`Error analyzing chapter ${chapterNum}:`, error);
        throw new Error(
          `Failed to process chapter ${chapterNum}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        );
      }
    },
  );

  const promiseResults = await Promise.allSettled(analysisPromises);

  promiseResults.forEach((result) => {
    if (result.status === "fulfilled") {
      results[result.value.chapterKey] = result.value.data;
    } else {
      console.warn(`A chapter analysis failed: ${result.reason}`);
    }
  });

  if (Object.keys(results).length === 0) {
    return {
      success: false,
      error: `Failed to analyze any chapters. Check console for details.`,
    };
  }

  return {
    success: true,
    data: results,
  };
};

/**
 * Method 3: Analyze chapters with context from previous chapters
 */
const analyzeWithContext = async (
  storyData: Map<string, ChapterData>,
): Promise<
  AnalysisResult<Record<string, ContextualStoryAnalysisWithScore>>
> => {
  try {
    const results: Record<string, ContextualStoryAnalysisWithScore> = {};
    let currentMasterDocument: MasterStoryDocument | undefined;

    for (const [chapterNum, content] of storyData.entries()) {
      const prompt = createContextualAnalysisPrompt(
        content,
        currentMasterDocument,
      );

      const response: ContextualStoryAnalysis = await langChainClient
        .withStructuredOutput(contextualAnalysisSchema)
        .invoke(prompt);

      const score = await calculateScore(content, response.chapterOutline);

      results[`chapter_${chapterNum}`] = {
        ...response,
        ...score,
      };

      const masterDocPrompt = await createNextMasterDocFromOutlinePrompt(
        response.chapterOutline,
        currentMasterDocument,
      );

      currentMasterDocument = await langChainClient
        .withStructuredOutput(MasterStoryDocumentSchema)
        .invoke(masterDocPrompt);
    }

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    console.error("Error in analyzeWithContext:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export {
  analyzeText,
  analyzeFiles,
  analyzeLink,
  analyzeStory,
  analyzeSequentially,
  analyzeWithContext,
};
