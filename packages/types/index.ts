import z from "zod";
import type {
  IndividualChapterAnalysis,
  MasterStoryDocument,
} from "./analysisTypes.js";

export * from "./analysisTypes.js";

export type UserChapterData = {
  title: string;
  content: string;
  number: number;
};

export type UserStoryData = {
  id: string;
  name: string;
  chapters: UserChapterData[];
};

export type AnalysisRequest = {
  storyId: string;
};

export type AnalysisJobStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED";

export type AnalysisJobSimpleData = {
  id: string;
  status: AnalysisJobStatus;
  createdAt: string;
  method: AnalysisMethod;
};

// The outline is included in the master story document
export type CompleteContextualChapterAnalysis = {
  masterStoryDocument: MasterStoryDocument;
};
export type CompleteIndividualChapterAnalysis = {
  analysis: IndividualChapterAnalysis;
};

export type IndividualStoryAnalysis = {
  id: string;
  number: number;
  analysisResults: CompleteIndividualChapterAnalysis;
  score: number;
  scoreRationale: string;
}[];

export type ContextualStoryAnalysis = {
  id: string;
  number: number;
  analysisResults: CompleteContextualChapterAnalysis;
  score: number;
  scoreRationale: string;
}[];

export const scoreSchema = z.object({
  score: z.number(),
  rationale: z.string(),
});

export type Score = z.infer<typeof scoreSchema>;

export type AnalysisJobData = {
  id: string;
  status: AnalysisJobStatus;
  method: AnalysisMethod;
  storyAnalysis: IndividualStoryAnalysis | ContextualStoryAnalysis;
};

export type AnalysisResult<T> =
  | {
      success: true; // <-- Note: literal 'true'
      data: T;
    }
  | {
      success: false; // <-- Note: literal 'false'
      error: string;
    };

export type AnalysisMethod = "individual" | "contextual";
