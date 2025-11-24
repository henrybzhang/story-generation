import z from "zod";
import { SceneSchema } from "./sceneSchema";

export const ChapterAnalysisSchema = z.object({
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
          "3-5 sentences that exemplify the narrator's voice/style. Preserve EXACT wording from text. Use quotation marks.",
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
          .describe("If the text explicitly stated the rule, quote it. Otherwise, describe it in your own words."),
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

        actions: z.array(z.string()).describe(
          "What they DID (concrete actions). FORMAT: '[ACTION] [TARGET] [METHOD/CONTEXT]'. Always specify WHO or WHAT when relevant. Examples: 'Rides Danny to multiple orgasms', 'Seduces Charles through negotiation', 'Sits on Holly's lap wetly'."
        ),

        emotionalStates: z
          .array(
            z.object({
              state: z.string(),
              triggeredBy: z.string(),
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
          .describe(
            "New factual information this specific character learned IN THIS CHAPTER that they did not know before. Each item should be something concrete that was revealed TO this character. Do NOT include: (1) information the character already knew before this chapter, (2) information revealed ABOUT the character but not TO them, (3) suspicions or implications rather than confirmed facts learned by the character."
          ),

        decisionsPoints: z
          .array(
            z.object({
              decision: z.string().describe("The specific choice or action the character took, stated clearly."),
              alternatives: z.array(z.string()).describe("Other choices that were explicitly available or implied to be possible. Be specific about what the alternatives would have been."),
              reasoning: z.string().describe("Why the character made this choice based on their knowledge, motivations, or circumstances at the time. Include any explicit reasoning from the text or clear implicit motivations."),
            }),
          )
          .optional()
          .describe("Significant moments where the character actively made a consequential choice. Only include decisions where alternatives existed and the choice mattered to the plot or character development."),
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
        element: z.string().describe("What was hinted at or set up for potential future relevance. Include: unexplained abilities, mysterious rules/rituals, ominous warnings, unresolved questions deliberately planted, or story elements that feel incomplete/setup for later payoff."),
        exactPhrasing: z.string().describe("Quote the foreshadowing directly from the text."),
        subtlety: z.enum(["Obvious", "Moderate", "Subtle", "Buried"]),
      potentialSignificance: z.string().describe("What this might be setting up or why it seems important for future chapters. Focus on story mechanics, character development, or plot threads rather than thematic elements."),
    }),
  )
  .optional(),

  mysteriesProgressed: z
  .array(
    z.object({
      mystery: z.string().describe("An ongoing question, unknown, or unresolved situation that the PROTAGONIST or READER does not have full answers to. This should be something characters are actively curious about or that creates narrative tension. Do NOT include: information asymmetry between characters where the reader/protagonist knows the truth (e.g., Character A doesn't know Character B's secret, but the reader does)."),
      newClue: z.string().describe("New concrete information revealed in this chapter that provides partial insight into the mystery. Should be factual evidence, revelations, or discovered information—not just character reactions or implications."),
      revealedBy: z.string().describe("What action, event, or character revealed this new information. Be specific about the mechanism of revelation."),
    }),
  )
  .describe("Track progress on ongoing story mysteries and questions that the protagonist or reader is actively seeking answers to. Only include when genuine new information is revealed about an unknown element."),

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

export type ChapterAnalysis = z.infer<typeof ChapterAnalysisSchema>;