export type ChapterAnalysisTestAssertion = {
  id: string;
  category:
    | "Character"
    | "Relationship"
    | "WorldConcept"
    | "Foreshadowing"
    | "Quote"
    | "EroticText";
  description: string;
  severity: "Critical" | "Important" | "Minor";
  assertion: {
    type:
      | "character_exists"
      | "relationship_exists"
      | "scene_count"
      | "foreshadowing_exists"
      | "quote_exists"
      | "erotic_text_exists";
    params: Record<string, string>;
  };
};

export type ChapterAnalysisTestSuite = {
  chapterNumber: number;
  assertions: ChapterAnalysisTestAssertion[];
};

export type ChapterAnalysisAssertionResult = {
  assertionId: string;
  passed: boolean;
  message: string;
};

export type ChapterAnalysisTestResult = {
  chapterNumber: number;
  totalTests: number;
  passed: number;
  failed: number;
  criticalFailures: number;
  passRate: number;
  results: ChapterAnalysisAssertionResult[];
  overallPass: boolean;
};
