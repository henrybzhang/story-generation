import type { ChapterAnalysisTestSuite } from "@/src/types/test";

export const chapter13TestSuite: ChapterAnalysisTestSuite = {
  chapterNumber: 13,
  assertions: [
    {
      id: "chapter13_character_exists_Calli",
      category: "Character",
      description: "Calli exists in the chapter",
      severity: "Critical",
      assertion: {
        type: "character_exists",
        params: {
          name: "Callistryllaxia",
        },
      },
    },
    {
      id: "chapter13_quote_exists_control_men",
      category: "Quote",
      description: "Quote exists in the chapter",
      severity: "Critical",
      assertion: {
        type: "quote_exists",
        params: {
          quote: "But no men are _really_ in control when I’m around",
        },
      },
    },
    {
      id: "chapter13_erotic_text_exists_clench",
      category: "EroticText",
      description: "Text exists in the chapter",
      severity: "Critical",
      assertion: {
        type: "erotic_text_exists",
        params: {
          text: "I felt her pussy give a teasing little clench around me",
        },
      },
    },
  ],
};
