import z from "zod";

// ---------------------------------------------------------
// 2. WORLD BUILDING & MAGIC (The "Wiki")
// ---------------------------------------------------------
export const WorldBuildingSchema = z.object({
  loreEntries: z
    .array(
      z.object({
        term: z.string(), // e.g., "Thaumaturge"
        category: z.enum([
          "Magic System",
          "Location",
          "Organization",
          "History",
          "Item",
        ]),
        definition: z.string().describe("Detailed explanation of the term."),
        rules: z
          .array(z.string())
          .describe("Hard rules (e.g., 'Magic requires a blood sacrifice')."),
        plotRelevance: z
          .string()
          .describe("Why this matters to the current story."),
      }),
    )
    .describe("The glossary of the world."),

  activeMysteries: z.array(
    z.object({
      mysteryName: z.string(),
      cluesFound: z.array(z.string()),
      currentTheory: z
        .string()
        .describe("What the protagonist currently thinks is true."),
    }),
  ),
});

// ---------------------------------------------------------
// 3. THE NARRATIVE LOG (The "Memory")
// ---------------------------------------------------------
export const NarrativeLogSchema = z.object({
  chapterNumber: z.number(),
  title: z.string(),
  timePassed: z
    .string()
    .describe("How much time passed since previous chapter."),
  setting: z.string(),

  // The core story movement
  plotSummary: z.string().describe("Detailed summary of events."),

  // Specific details for continuity
  keyDialogue: z.array(
    z.object({
      speakers: z.array(z.string()),
      topic: z.string(),
      outcome: z.string().describe("What was agreed upon or revealed?"),
    }),
  ),

  // Physical changes to the state of the world
  consequences: z.object({
    itemsAcquired: z.array(z.string()),
    injuriesOrMarks: z.array(z.string()),
    promisesMade: z
      .array(z.string())
      .describe("Promises or contracts characters are now bound by."),
  }),

  // Erotic Progression
  eroticBeats: z.array(
    z.object({
      participants: z.array(z.string()),
      act: z.string(),
      emotionalResult: z
        .string()
        .describe("How did this impact their relationship?"),
    }),
  ),
});

export const ChapterAnalysisSchema = z.object({
  // NARRATIVE & PLOT
  title: z.string(),
  summary: z.string().describe("Detailed summary of the plot action."),
  timeElapsed: z.string().describe("Time passed since last chapter."),

  majorEvents: z.array(
    z.object({
      description: z.string(),
      consequence: z
        .string()
        .describe(
          "Does this change a relationship, add an item, or reveal a secret?",
        ),
      importance: z.enum(["Low", "Medium", "High", "Critical"]),
    }),
  ),

  // WORLD & LORE
  newLore: z
    .array(
      z.object({
        term: z.string(),
        category: z.string(),
        definition: z.string(),
        plotRelevance: z.string(),
      }),
    )
    .describe("New magic rules, locations, or history revealed."),

  // CHARACTER & PSYCHOLOGY UPDATES
  characterUpdates: z.array(
    z.object({
      name: z.string(),
      emotionalState: z.string().describe("Current mood at end of chapter."),
      newInternalConflict: z
        .string()
        .optional()
        .describe("If a new inner struggle emerged."),
      developmentNote: z
        .string()
        .describe("How they changed/grew in this chapter."),
    }),
  ),

  // EROTIC ANALYSIS (Lexicon Applied Here)
  eroticScenes: z.array(
    z.object({
      participants: z.array(z.string()),
      lexiconTags: z.array(z.string()).describe("Tags from the Kink Lexicon."),
      powerDynamicsDesc: z
        .string()
        .describe("Who held power and how it shifted."),
      eroticRealism: z
        .string()
        .describe(
          "Notes on the emotional/awkward/realistic aspects of the encounter.",
        ),
    }),
  ),
});

// ---------------------------------------------------------
// 4. CHARACTER ANALYSIS (The "Brain")
// ---------------------------------------------------------
export const CharacterAnalysisSchema = z.object({
  characterName: z.string(),
  role: z.enum(["Protagonist", "Antagonist", "Love Interest", "Confidant"]),

  // Physicality & Voice (For consistent descriptions)
  appearance: z.object({
    distinguishingFeatures: z
      .array(z.string())
      .describe("Scars, tattoos, specific fashion choices."),
    mannerisms: z
      .array(z.string())
      .describe("Habits like 'chews lip when nervous', 'taps foot'."),
    voice: z
      .string()
      .describe("Adjectives describing their sound and cadence."),
  }),

  // The Literary Core (For believable development)
  psychology: z.object({
    coreValues: z
      .array(z.string())
      .describe("What they believe in (e.g., 'Loyalty above all')."),
    internalConflict: z
      .string()
      .describe(
        "The war inside them (e.g., 'Desire for submission vs. Pride in independence').",
      ),
    theLie: z
      .string()
      .describe(
        "The lie they tell themselves (e.g., 'I am in control of this situation').",
      ),
    insecurities: z
      .array(z.string())
      .describe("Deep-seated fears that drive their actions."),
  }),

  // Arc Tracking
  narrativeArc: z.object({
    currentGoal: z.string().describe("What they want RIGHT NOW."),
    longTermDesire: z
      .string()
      .describe("What they ultimately want (conscious or unconscious)."),
    emotionalState: z
      .string()
      .describe("Current mood based on the last chapter."),
  }),

  // Erotic Context (Integrated into character, not just a list)
  eroticNature: z.object({
    orientation: z.string(),
    dynamicRole: z
      .string()
      .describe("Their role in power dynamics (e.g., 'Reluctant Brat')."),
    turnOns: z.array(z.string()),
    hardLimits: z.array(z.string()),
    // This is crucial for plot:
    eroticMotivations: z
      .string()
      .describe(
        "Why do they engage in sex? (e.g., 'Validation', 'Control', 'Escapism').",
      ),
  }),

  relationships: z.array(
    z.object({
      targetName: z.string(),
      dynamicSummary: z.string(),
      // Trust and Tension are better metrics for plot than just "Love"
      trustLevel: z.number().min(0).max(10),
      tensionLevel: z.number().min(0).max(10),
      sharedSecrets: z
        .array(z.string())
        .describe("Secrets these two share excluding others."),
    }),
  ),
});

// ---------------------------------------------------------
// 5. MASTER DOCUMENT
// ---------------------------------------------------------
export const MasterStoryDocumentSchema = z.object({
  meta: z.object({
    storyTitle: z.string(),
    storyTone: z
      .string()
      .describe("e.g., 'Psychological Horror', 'Slow-burn Romance'."),
    centralThemes: z.array(z.string()),
  }),

  // Big Picture
  globalPlotState: z.object({
    mainConflict: z.string(),
    stakes: z.string().describe("What happens if the protagonist fails?"),
    upcomingForeshadowing: z
      .array(z.string())
      .describe("Events we are building toward."),
  }),

  // The Database
  characters: z.array(CharacterAnalysisSchema),
  worldBuilding: WorldBuildingSchema,

  // The Full History (We keep this!)
  narrativeLog: z
    .array(NarrativeLogSchema)
    .describe("Chronological log of every chapter."),
});

export const individualAnalysisSchema = z.object({
  chapterOutline: NarrativeLogSchema.describe("The chapter outline."),
  characters: z
    .array(CharacterAnalysisSchema)
    .describe(
      "An array of in-depth analyses for each major character in the story.",
    ),
});

export const contextualAnalysisSchema = z.object({
  chapterOutline: NarrativeLogSchema.describe("The chapter outline."),
});

export const scoreSchema = z.object({
  value: z.number().describe("The score out of 100."),
  rationale: z.string().describe("The rationale for the score."),
});

export type IndividualChapterAnalysis = z.infer<
  typeof individualAnalysisSchema
>;
export type ContextualChapterPartialAnalysis = z.infer<
  typeof contextualAnalysisSchema
>;
export type MasterStoryDocument = z.infer<typeof MasterStoryDocumentSchema>;
export type CharacterSheet = z.infer<typeof CharacterAnalysisSchema>;
export type ChapterOutline = z.infer<typeof NarrativeLogSchema>;
export type Score = z.infer<typeof scoreSchema>;
