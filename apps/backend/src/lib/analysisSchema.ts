// Template for chapter outline analysis
import { z } from "zod";
import type { ChapterData } from "../types/storyAnalysis.js";

export const kinkLexicon = `
- **Core Dynamics:** Femdom, Hypnosis, Mind Control, Mental Conditioning, Power Exchange, BDSM, Sex Magic
- **Psychological Play:** Amnesia Play, Gaslighting (Erotic), Tease and Denial, Praise Kink, Erotic Humiliation, Playful Humiliation, Affectionate Degradation, Trigger Play, Sensory Deprivation, Manipulation, Engineered Failure / Impossible Tasks, Abuse of Authority, Public / Semi-Public Play, Corruption, Addiction Play, Fractionation
- **Physical Play:** Bondage, Impact Play, Spanking, Pegging, Orgasm Control / Denial, Chastity
- **Fetishes & Roles:** Feet Fetish, Pet Play, Light Masochism
`;

export const createSequentialAnalysisPrompt = (chapterContent: ChapterData) => {
  return `Analyze the following story chapter and provide a detailed summary outline and a detailed character analysis for **all major characters** found in the chapter.

  **Your primary focus is to identify and analyze the erotic content, power dynamics, and specific kink elements alongside the standard plot.**

You MUST use the following **Kink & Dynamics Lexicon** when populating the \`eroticAnalysis\` and \`eroticProfile\` fields.
<KinkLexicon>
${kinkLexicon}
</KinkLexicon>

<StoryChapter>
${chapterContent.title}\n\n${chapterContent.content}
</StoryChapter>`;
};

export const createContextualAnalysisPrompt = (
  chapterContent: ChapterData,
  masterDoc?: MasterStoryDocument,
) => {
  let prompt = `Analyze the following story chapter and provide a detailed summary outline.

**Your primary focus is to identify and analyze the erotic content, power dynamics, and specific kink elements alongside the standard plot.**

You MUST use the following **Kink & Dynamics Lexicon** when populating the \`eroticAnalysis\` and \`eroticProfile\` fields.
<KinkLexicon>
${kinkLexicon}
</KinkLexicon>`;

  if (masterDoc) {
    prompt += `
Use the following Master Story Document for context on existing characters, subplots, and power dynamics:
<MasterStoryDocument>
${JSON.stringify(masterDoc, null, 2)}
</MasterStoryDocument>
`;
  }

  prompt += `
<StoryChapter>
${chapterContent.title}\n\n${chapterContent.content}
</StoryChapter>`;

  return prompt;
};

export const createNextMasterDocFromOutlinePrompt = (
  chapterOutline: ChapterOutline,
  previousMasterDoc?: MasterStoryDocument,
) => {
  // This detailed set of instructions tells the AI *how* to perform the update.
  const masterDocInstructions = `
You are a meticulous Story Database Manager. Your job is to take a Chapter Outline and use it to update (or create) a Master Story Document.

This Master Story Document is the "Story Bible." It must be a **synthesis** of all information, not just a list.

**Your Update/Creation Process MUST follow these rules:**

1.  **\`chapterOutlines\`**: Append the *entire* new Chapter Outline to this array.
2.  **\`characterSheets\`**:
    * For each character in the outline's \`characterDevelopment\`, find their sheet in \`characterSheets\`.
    * If they don't exist, **create a new one**.
    * **Synthesize** the new \`development\` text into their existing \`characterArc\` or \`background\`.
    * **Use the \`eroticAnalysis\`** from the outline to update or create the character's \`eroticProfile\` (their role, kinks, and conditioning state).
3.  **\`powerDynamics\`**:
    * Review the \`eroticAnalysis\` section of the new outline.
    * Use this to **update the \`currentState\`** of any existing power dynamics.
    * If a new dynamic is introduced (e.g., two characters have a new power-exchange scene), **add a new entry** to this array.
4.  **\`activeSubplots\`**:
    * Review the \`keyPlotDevelopments\` and \`unresolvedHooks\`.
    * Update the \`description\` of any existing subplots or add new ones as needed.
5.  **\`keyThemes\`**: Add any new themes from the outline's \`themes\` section if they aren't already listed.
6.  **\`storyTitle\` & \`logline\`**: Carry these over. If it's the first chapter, populate them from the outline if possible, otherwise use placeholders.

**Output Instructions:**
You MUST output **only** the complete, updated, valid JSON for the *new* MasterStoryDocument. Do not include any commentary, markdown, or explanations.
`;

  if (previousMasterDoc) {
    return `
${masterDocInstructions}

<Kink & Dynamics Lexicon (For context):>
${kinkLexicon}
</Kink & Dynamics Lexicon (For context):>

---

Your task is to **update** the following \`PreviousMasterStoryDocument\` using the data from the \`ChapterOutline\`. Follow all rules.

<PreviousMasterStoryDocument>
${JSON.stringify(previousMasterDoc, null, 2)}
</PreviousMasterStoryDocument>

<ChapterOutline>
${JSON.stringify(chapterOutline, null, 2)}
</ChapterOutline>

Return the complete, updated JSON for the new Master Story Document.
`;
  } else {
    return `
${masterDocInstructions}

<Kink & Dynamics Lexicon (For context):>
${kinkLexicon}
</Kink & Dynamics Lexicon (For context):>

---

This is the **first chapter**, so there is no previous document.

Your task is to **create a new Master Story Document** based *only* on the following \`ChapterOutline\`.
Follow all rules to populate \`characterSheets\`, \`powerDynamics\`, \`activeSubplots\`, etc.

<ChapterOutline>
${JSON.stringify(chapterOutline, null, 2)}
</ChapterOutline>

Return the complete, new JSON for the Master Story Document.
`;
  }
};

// Schema for the Chapter Outline, based on outlineStructure
const ChapterOutlineSchema = z.object({
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
const CharacterAnalysisSchema = z.object({
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

export const sequentialAnalysisSchema = z.object({
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
export type SequentialStoryAnalysis = z.infer<typeof sequentialAnalysisSchema>;
export type ContextualStoryAnalysis = z.infer<typeof contextualAnalysisSchema>;
export type MasterStoryDocument = z.infer<typeof MasterStoryDocumentSchema>;
export type CharacterSheet = z.infer<typeof CharacterAnalysisSchema>;
export type ChapterOutline = z.infer<typeof ChapterOutlineSchema>;
