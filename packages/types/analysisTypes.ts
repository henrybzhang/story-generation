import z from "zod";

// Schema for the Chapter Outline, based on outlineStructure
export const ChapterOutlineSchema = z.object({
  coreSummary: z
    .string()
    .describe(
      "One-paragraph summary of the chapter's main action or argument.",
    ),
  keyPlotDevelopments: z
    .array(z.string())
    .describe("List of 3-5 most significant events that advance the story."),
  characterDevelopment: z
    .array(
      z.object({
        characterName: z.string(),
        development: z
          .string()
          .describe(
            "2-3 sentences about this character's development or key actions in this chapter.",
          ),
      }),
    )
    .describe(
      "Analysis of significant character developments within this chapter.",
    ),
  themes: z
    .array(
      z.object({
        theme: z.string(),
        explanation: z
          .string()
          .describe("Brief explanation of how the theme is presented."),
      }),
    )
    .describe("Themes or motifs present in the chapter."),
  significantSetting: z
    .string()
    .describe("Any important setting details that impact the story."),
  keyQuote: z.object({
    quote: z.string(),
    significance: z
      .string()
      .describe("Explanation of the quote's significance."),
  }),
  foreshadowing: z
    .array(z.string())
    .describe("Any notes on setup or foreshadowing for future events."),
  unresolvedHooks: z
    .array(z.string())
    .describe(
      "List of 2-3 key unresolved questions, conflicts, or hooks left at the end of this chapter. What *needs* to be addressed next?",
    ),
  toneAndStyle: z
    .string()
    .describe(
      "The specific authorial voice, emotional tone, or pacing required for this chapter.",
    ),
  pointOfView: z
    .string()
    .describe(
      "The specific narrative perspective (e.g., 'Third-person limited, from [Character]'s POV').",
    ),
  eroticAnalysis: z
    .array(
      z.object({
        sceneSummary: z
          .string()
          .describe(
            "Brief, objective summary of the erotic scene or key dynamic interaction.",
          ),
        dynamicsInPlay: z
          .array(z.string())
          .describe(
            "List of core dynamics from the lexicon (e.g., 'Femdom', 'Tease and Denial', 'Mind Control').",
          ),
        specificActivities: z
          .array(z.string())
          .describe(
            "List of specific kinks, actions, or fetishes observed (e.g., 'Bondage', 'Praise Kink', 'Titfuck', 'Trigger Play').",
          ),
        powerShift: z
          .string()
          .describe(
            "How this scene changes, reinforces, or challenges the power balance between the involved characters.",
          ),
        psychologicalImpact: z
          .string()
          .describe(
            "Note on the scene's effect on a character's mental state, conditioning, boundaries, or emotional response.",
          ),
      }),
    )
    .describe(
      "A detailed breakdown of the chapter's key erotic scenes, power dynamics, and specific kinks.",
    ),
});

// Schema for the Character Analysis, based on characterStructure
export const CharacterAnalysisSchema = z.object({
  characterName: z.string().describe("The character's full name."),
  role: z
    .string()
    .describe(
      "Primary role in the story: Protagonist, Antagonist, Supporting, Mentor, Foil, etc.",
    ),
  firstAppearance: z
    .string()
    .describe("When and how the character first appears in the story."),
  vitals: z
    .string()
    .describe("Age, occupation, species, etc... Basic information if known."),
  physicalDescription: z
    .string()
    .describe(
      "Physical appearance, distinguishing features, mannerisms, or style.",
    ),
  personality: z.object({
    coreTraits: z.array(z.string()).describe("3-5 key personality adjectives."),
    strengths: z.array(z.string()).describe("List of key strengths."),
    flaws: z.array(z.string()).describe("List of key flaws or weaknesses."),
    values: z.string().describe("Core values or beliefs."),
  }),
  dialectAndVoice: z
    .string()
    .describe(
      "The character's speaking style, (e.g., 'Formal, academic, and precise' or 'Fast, witty, and filled with slang').",
    ),
  background: z.string().describe("Known history and background information."),
  relationships: z
    .array(
      z.object({
        characterName: z.string().describe("The name of the other character."),
        relationship: z
          .string()
          .describe("Nature of their relationship and key interactions."),
      }),
    )
    .describe("Relationships with other key characters."),
  motivations: z.object({
    primaryGoal: z.string().describe("The character's main objective."),
    drivingForce: z
      .string()
      .describe("What motivates them to pursue this goal."),
    internalConflict: z
      .string()
      .describe(
        "The primary internal struggle or paradox (e.g., 'Duty vs. Desire', 'Fear of failure vs. Ambition').",
      ),
  }),
  characterArc: z
    .string()
    .describe(
      "A summary of how the character changes or develops throughout the story.",
    ),
  keyQuotes: z.array(
    z
      .object({
        quote: z.string(),
        significance: z
          .string()
          .describe("Explanation of the quote's significance."),
      })
      .describe(
        "List of key quotes in the story that personalize the character.",
      ),
  ),
  eroticProfile: z
    .object({
      role: z
        .string()
        .describe(
          "Primary erotic role (e.g., 'Dominant', 'Submissive', 'Switch', 'Pet', 'Sadist', 'Masochist', 'Top', 'Bottom').",
        ),
      keyFetishes: z
        .array(z.string())
        .describe(
          "Known kinks, triggers, or fetishes this character has or engages in.",
        ),
      conditioningProgress: z
        .string()
        .describe(
          "Notes on their current state of mental conditioning, training, or corruption arc.",
        ),
      boundaries: z
        .string()
        .describe("Any known hard limits, boundaries, or safewords mentioned."),
    })
    .optional() // Make it optional as not all characters may have one
    .describe(
      "Profile of the character's role in power exchange and kink dynamics.",
    ),
});

export const MasterStoryDocumentSchema = z.object({
  storyTitle: z.string().describe("The working title of the story."),
  logline: z.string().describe("The one-sentence pitch for the main plot."),
  keyThemes: z
    .array(z.string())
    .describe("A list of the central themes (e.g., 'Betrayal', 'Redemption')."),
  activeSubplots: z
    .array(
      z.object({
        name: z.string().describe("Short name for the subplot."),
        description: z
          .string()
          .describe("A brief summary of this subplot's current state."),
      }),
    )
    .describe("A list of all active subplots the AI needs to track."),
  powerDynamics: z
    .array(
      z.object({
        relationship: z
          .string()
          .describe(
            "The characters involved (e.g., 'Viv / Matt', 'Lauren / Matt').",
          ),
        currentState: z
          .string()
          .describe(
            "Current state of their power dynamic (e.g., 'Viv has full control', 'Matt is being conditioned', 'Initial power struggle').",
          ),
        primaryKinks: z
          .array(z.string())
          .describe("The primary kinks being explored in this relationship."),
      }),
    )
    .describe(
      "An overview of the central power exchange relationships in the story.",
    ),
  characterSheets: z
    .array(CharacterAnalysisSchema)
    .describe("An array of all key character analysis sheets."),
  chapterOutlines: z
    .array(ChapterOutlineSchema)
    .describe(
      "An array of all previously generated chapter outlines, in order.",
    ),
});

export const individualAnalysisSchema = z.object({
  chapterOutline: ChapterOutlineSchema.describe("The chapter outline."),
  characters: z
    .array(CharacterAnalysisSchema)
    .describe(
      "An array of in-depth analyses for each major character in the story.",
    ),
});

export const contextualAnalysisSchema = z.object({
  chapterOutline: ChapterOutlineSchema.describe("The chapter outline."),
});

// You can now infer the TypeScript type directly from the schema
export type IndividualChapterAnalysis = z.infer<
  typeof individualAnalysisSchema
>;
export type ContextualChapterAnalysis = z.infer<
  typeof contextualAnalysisSchema
>;
export type MasterStoryDocument = z.infer<typeof MasterStoryDocumentSchema>;
export type CharacterSheet = z.infer<typeof CharacterAnalysisSchema>;
export type ChapterOutline = z.infer<typeof ChapterOutlineSchema>;
