import z from "zod";
import type { ChapterSummary } from "./schemas/chapterSummarySchema";
import type { MasterStoryDocument, Score } from "./schemas/masterSchema";

export * from "./schemas/chapterSummarySchema";
export * from "./schemas/masterSchema";

// --- 1. Zod Schemas as Single Source of Truth ---
export enum AnalysisMethod {
  INDIRECT = "indirect",
}

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
  lastChapterNumber: number;
};

export type AnalysisJobSimpleData = {
  id: string;
  status: AnalysisJobStatus;
  createdAt: string; // Note: You could use z.string().datetime() for this
  method: AnalysisMethod;
};

// --- 3. Discriminated Union for Analysis Data ---

export type BaseAnalysisData = {
  number: number;
  score: Score;
};

export type IndirectChapterAnalysisData = BaseAnalysisData & {
  analysis: {
    chapterSummary: ChapterSummary;
    masterStoryDocument: MasterStoryDocument;
  };
};

// Base type for a job
type BaseAnalysisJobData = {
  id: string;
  status: AnalysisJobStatus;
};

export type IndirectAnalysisJobData = BaseAnalysisJobData & {
  method: AnalysisMethod.INDIRECT;
  storyAnalysis: {
    id: string;
    chapterAnalyses: IndirectChapterAnalysisData[];
  };
};

// Final discriminated union type
export type AnalysisJobData = IndirectAnalysisJobData;

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
