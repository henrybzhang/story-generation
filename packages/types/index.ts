import z from "zod";
import type {
  IndividualChapterAnalysis,
  MasterStoryDocument,
  Score,
} from "./analysisTypes.js";

export * from "./analysisTypes.js"; // This is still fine

// --- 1. Zod Schemas as Single Source of Truth ---
export const AnalysisMethodSchema = z.enum(["individual", "contextual"]);
export type AnalysisMethod = z.infer<typeof AnalysisMethodSchema>;

export const AnalysisJobStatusSchema = z.enum([
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "FAILED",
]);
export type AnalysisJobStatus = z.infer<typeof AnalysisJobStatusSchema>;

// --- 2. Clear DTOs (Data Transfer Objects) ---
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

export type AnalysisJobSimpleData = {
  id: string;
  status: AnalysisJobStatus;
  createdAt: string; // Note: You could use z.string().datetime() for this
  method: AnalysisMethod;
};

// --- 3. Discriminated Union for Analysis Data ---

// Describes the *full row* of data for an analyzed chapter
export type IndividualChapterAnalysisData = {
  number: number;
  analysis: IndividualChapterAnalysis;
  score: Score;
};

export type ContextualChapterAnalysisData = {
  number: number;
  analysis: MasterStoryDocument;
  score: Score;
};

// Base type for a job
type BaseAnalysisJobData = {
  id: string;
  status: AnalysisJobStatus;
};

// Specific job types
export type IndividualAnalysisJobData = BaseAnalysisJobData & {
  method: "individual";
  storyAnalysis: {
    id: string;
    chapterAnalyses: IndividualChapterAnalysisData[];
  };
};

export type ContextualAnalysisJobData = BaseAnalysisJobData & {
  method: "contextual";
  storyAnalysis: {
    id: string;
    chapterAnalyses: ContextualChapterAnalysisData[];
  };
};

// Final discriminated union type
export type AnalysisJobData =
  | IndividualAnalysisJobData
  | ContextualAnalysisJobData;

// --- 4. Generic Helper Types ---
export type AnalysisResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };
