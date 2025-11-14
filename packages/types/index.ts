import z from "zod";
import type {
  ContextualChapterAnalysis,
  MasterStoryDocument,
  SequentialChapterAnalysis,
} from "./analysisTypes.js";

export * from "./analysisTypes.js";

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

export type CompleteContextualChapterAnalysis = ContextualChapterAnalysis & {
  score: Score;
  masterStoryDocument: MasterStoryDocument;
};
export type CompleteSequentialChapterAnalysis = SequentialChapterAnalysis & {
  score: Score;
  masterStoryDocument: MasterStoryDocument;
};

export const scoreSchema = z.object({
  score: z.number(),
  rationale: z.string(),
});

export type Score = z.infer<typeof scoreSchema>;
