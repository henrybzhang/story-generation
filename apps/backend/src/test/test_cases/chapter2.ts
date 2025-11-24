import type { ChapterAnalysisTestSuite } from "@/src/types/test";

export const chapter2TestSuite: ChapterAnalysisTestSuite = {
  chapterNumber: 2,
  assertions: [
    {
      id: "chapter2_quote_exists_staring",
      category: "Quote",
      description: "Quote exists in the chapter",
      severity: "Critical",
      assertion: {
        type: "quote_exists",
        params: {
          quote: "God. You're _still_\nstaring at them.",
        },
      },
    },
  ],
};
