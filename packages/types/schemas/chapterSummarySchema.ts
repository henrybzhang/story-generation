import z from "zod";
import { SceneSchema } from "./sceneSchema";

export const ChapterSummarySchema = z.object({
  chapterNumber: z.number(),
  title: z.string(),
  wordCount: z.number(),

  context: z.object({
    timeElapsed: z.string().describe("Duration of events in this chapter."),
    timeOfDay: z.string().optional(),
    setting: z.array(z.string()).describe("All locations that appeared."),
    primaryPOV: z.array(z.string()).describe("Whose perspective(s) dominated."),
  }),

  scenes: z.array(SceneSchema),

  narrativeVoice: z
    .object({
      excerpts: z
        .array(z.string())
        .describe(
          "3-5 sentences that exemplify the narrator's voice/style. Preserve exact wording.",
        ),
      styleNotes: z
        .string()
        .describe(
          "Observations about prose style (e.g., 'Lyrical with long sentences', 'Terse and punchy', 'Heavy internal monologue', 'Sensory-rich').",
        ),
    })
    .optional()
    .describe("Preserve the writing style for continuation consistency."),

  // -------------------------
  // WORLD MECHANICS
  // -------------------------
  detectedWorldRules: z
    .array(
      z.object({
        rule: z.string(),
        context: z
          .string()
          .describe("Where in the chapter this rule appeared."),
        type: z.enum([
          "Magic System",
          "Technology",
          "Social Hierarchy",
          "Biology",
          "Compulsion Mechanic",
          "Law",
          "Economy",
          "Other",
        ]),
        exactPhrasing: z
          .string()
          .optional()
          .describe("If the text explicitly stated the rule, quote it."),
        isNew: z
          .boolean()
          .describe("Is this a rule that hasn't appeared before?"),
        contradictsExisting: z.boolean(),
      }),
    )
    .describe("Extract every world-building rule mentioned or demonstrated."),

  // -------------------------
  // CHARACTER DATA
  // -------------------------
  characterAppearances: z
    .array(
      z.object({
        name: z.string(),
        role: z
          .enum(["Major", "Supporting", "Minor", "Mentioned"])
          .describe("How much screentime they had."),

        actions: z
          .array(z.string())
          .describe("What they DID (not interpretation—concrete actions)."),

        emotionalStates: z
          .array(
            z.object({
              state: z.string(),
              triggeredBy: z.string().optional(),
            }),
          )
          .describe("Track emotional shifts within the chapter."),

        physicalChanges: z
          .array(z.string())
          .optional()
          .describe(
            "Injuries, exhaustion, appearance changes, arousal states.",
          ),

        knowledgeGained: z
          .array(z.string())
          .optional()
          .describe("New information this character learned."),

        decisionsPoints: z
          .array(
            z.object({
              decision: z.string(),
              alternatives: z.array(z.string()).optional(),
              reasoning: z.string().optional(),
            }),
          )
          .optional()
          .describe("Moments where character made a choice."),
      }),
    )
    .describe("Per-character extraction. Track everyone who appeared."),

  relationshipMoments: z
    .array(
      z.object({
        characters: z.array(z.string()).min(2),
        momentType: z.enum([
          "First Meeting",
          "Conflict",
          "Intimacy",
          "Betrayal",
          "Alliance",
          "Revelation",
          "Compulsion",
          "Seduction",
          "Other",
        ]),
        description: z.string(),
        trustImpact: z
          .enum([
            "Major Increase",
            "Increase",
            "Neutral",
            "Decrease",
            "Major Decrease",
          ])
          .optional(),
        lustImpact: z
          .enum([
            "Major Increase",
            "Increase",
            "Neutral",
            "Decrease",
            "Major Decrease",
          ])
          .optional(),
        powerShift: z.string().optional(),
      }),
    )
    .optional()
    .describe("Key relationship developments between character pairs."),

  foreshadowingElements: z
    .array(
      z.object({
        element: z.string().describe("What was hinted at."),
        exactPhrasing: z.string().describe("Quote the foreshadowing directly."),
        subtlety: z.enum(["Obvious", "Moderate", "Subtle", "Buried"]),
      }),
    )
    .optional(),

  mysteriesProgressed: z
    .array(
      z.object({
        mystery: z.string(),
        newClue: z.string(),
        revealedBy: z.string().optional(),
      }),
    )
    .optional(),

  // -------------------------
  // QUALITY CONTROL
  // -------------------------
  extractionMetrics: z.object({
    quotesExtracted: z.number().describe("Count of keyQuotes."),
    sensoryDetailsExtracted: z.number(),
    compulsionInstancesExtracted: z.number(),
    eroticScenesExtracted: z.number(),

    completenessScore: z
      .number()
      .min(0)
      .max(10)
      .describe(
        "Self-assessment: 1-3 = Rushed/missing data, 4-6 = Adequate, 7-8 = Thorough, 9-10 = Exhaustive. If below 8, you've missed something.",
      ),

    missedElements: z
      .array(z.string())
      .optional()
      .describe(
        "If completenessScore < 9, what did you likely miss? (Self-critique)",
      ),
  }),

  extractorNotes: z
    .array(z.string())
    .optional()
    .describe(
      "Free-form notes about unusual elements, ambiguities, or things requiring human clarification.",
    ),
});

export type ChapterSummary = z.infer<typeof ChapterSummarySchema>;