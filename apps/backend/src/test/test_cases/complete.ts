import type { ChapterAnalysisTestSuite } from "@/src/types/test";
import { chapter2TestSuite } from "./chapter2";
import { chapter13TestSuite } from "./chapter13";

export const completeTestSuite: Record<number, ChapterAnalysisTestSuite> = {
  13: chapter13TestSuite,
  2: chapter2TestSuite,
};
