import type { Score } from "../lib/scoreSchema.ts";

// Define types for our structured output
export interface ChapterAnalysis {
  outline: string;
  characters: Record<string, string>;
  context?: string;
}

export interface StoryAnalysis {
  chapterOutlines: Record<string, ChapterAnalysis>;
  characters: Record<string, string>; // Combined character analyses
}

export interface ChapterData {
  title: string;
  content: string;
}

export interface AnalysisRequest {
  storyData: Map<string, ChapterData>;
}

export type AnalysisResult<T> =
  | {
      success: true; // <-- Note: literal 'true'
      data: T;
    }
  | {
      success: false; // <-- Note: literal 'false'
      error: string;
    };

export type AnalysisMethod = "sequential" | "contextual";

export type ContextualStoryAnalysisWithScore = ContextualStoryAnalysis & {
  score: Score;
};
export type SequentialStoryAnalysisWithScore = SequentialStoryAnalysis & {
  score: Score;
};
