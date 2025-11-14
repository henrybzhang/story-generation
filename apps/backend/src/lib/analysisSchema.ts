// Template for chapter outline analysis
import type {
  ChapterData,
  ChapterOutline,
  MasterStoryDocument,
} from "@story-generation/types";

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
