// Template for chapter outline analysis

import type {
  ChapterOutline,
  MasterStoryDocument,
} from "@story-generation/types";
import type { ChapterData } from "@/generated/prisma/client.js";

export const kinkLexicon = `
- **Core Dynamics:** Femdom, Hypnosis, Mind Control, Mental Conditioning, Power Exchange, BDSM, Sex Magic
- **Psychological Play:** Amnesia Play, Gaslighting (Erotic), Tease and Denial, Praise Kink, Erotic Humiliation, Playful Humiliation, Affectionate Degradation, Trigger Play, Sensory Deprivation, Manipulation, Engineered Failure / Impossible Tasks, Abuse of Authority, Public / Semi-Public Play, Corruption, Addiction Play, Fractionation
- **Physical Play:** Bondage, Impact Play, Spanking, Pegging, Orgasm Control / Denial, Chastity
- **Fetishes & Roles:** Feet Fetish, Pet Play, Light Masochism
`;

export const createIndividualAnalysisPrompt = (chapterContent: ChapterData) => {
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
    Your task is to be a meticulous Story Bible continuity editor. You will take a <ChapterOutline> and use it to update a <PreviousMasterStoryDocument>.

    **Guiding Principles:**
    * **Synthesis, Not Replacement:** Your primary goal is to *synthesize* new information. When updating a field (like a character arc or subplot description), you must merge the new information with the old, not just replace the old.
    * **Preserve All Old Data:** Do not delete or overwrite any existing information unless a rule explicitly tells you to.
    * **Infer Logically:** The <ChapterOutline> provides *new* developments. You must logically integrate these developments into the existing document structure.

    **Your Update/Creation Process MUST follow these rules:**

    0.  **\`storyTitle\` & \`logline\`**:
        * If this is the first chapter (no \`PreviousMasterStoryDocument\`), populate these from the outline's \`coreSummary\` (inferring a title/logline) or use "Untitled Story" and "Logline TBD" as placeholders.
        * If updating, carry them over unchanged from the \`PreviousMasterStoryDocument\`.

    1.  **\`chapterOutlines\`**:
        * Append the *entire* new \`ChapterOutline\` object to the end of this array.

    2.  **\`characterSheets\`**: (This is the most critical task. Follow it precisely.)
        * For each character in the outline's \`characterDevelopment\` array:
        * **IF a sheet exists** (matching \`characterName\`):
            * Find their sheet in \`PreviousMasterStoryDocument.characterSheets\`.
            * Take the new \`development\` string from the outline.
            * Append this string as a new bullet point or paragraph to the *end* of the existing \`characterArc\` field, prefixed with the chapter (e.g., "Chapter 1: [development text]").
            * **Do not** create a new sheet for them.
        * **IF a sheet does NOT exist**:
            * This is a **new character**.
            * Create a *new* \`CharacterAnalysisSchema\` object for them.
            * Populate \`characterName\` with their name.
            * Populate the \`characterArc\` field with the \`development\` string from the outline (e.g., "Chapter 0: [development text]").
            * Populate \`firstAppearance\` with a note (e.g., "Introduced in Chapter X").
            * Fill *all other required fields* with placeholder strings like "UNKNOWN" or "To be determined."
            * Add this new sheet object to the \`characterSheets\` array.

    3.  **\`powerDynamics\`**:
        * Review the outline's \`eroticAnalysis\` array.
        * For each scene, identify the characters involved.
        * Search the \`powerDynamics\` array for an existing entry matching that \`relationship\`.
        * **IF it exists**: Synthesize the \`powerShift\` and \`psychologicalImpact\` from the outline to *update* the \`currentState\` description. Also, add any new \`specificActivities\` to the \`primaryKinks\` list (avoid duplicates).
        * **IF it does NOT exist**: Create a new \`powerDynamics\` entry.
            * \`relationship\`: "[Character A] / [Character B]"
            * \`currentState\`: Use the \`powerShift\` and \`psychologicalImpact\` to write a *new* summary.
            * \`primaryKinks\`: Populate from the \`dynamicsInPlay\` and \`specificActivities\`.

    4.  **\`activeSubplots\`**:
        * Review the outline's \`keyPlotDevelopments\` and \`unresolvedHooks\`.
        * **IF** they clearly relate to an *existing* subplot: Find that subplot in the \`activeSubplots\` array and *append* a summary of the new developments to its \`description\`.
        * **IF** they clearly introduce a *new* subplot: Add a new entry to the \`activeSubplots\` array.
            * \`name\`: Create a short, descriptive name (e.g., "The Missing Locket").
            * \`description\`: Summarize the new plot point.

    5.  **\`keyThemes\`**:
        * For each theme in the outline's \`themes\` array, check if a similar theme (e.g., \`theme.theme\`) already exists in the \`keyThemes\` string array.
        * If it does *not* exist, add the \`theme.theme\` string to the \`keyThemes\` array.
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
