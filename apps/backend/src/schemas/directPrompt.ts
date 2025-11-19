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

export const createNextMasterDocFromChapterAnalysisPrompt = (
  chapterOutline: ChapterOutline,
  previousMasterDoc?: MasterStoryDocument,
) => {
  return `
    You are the **Lead Narrative Architect** for a complex, character-driven story. 
    Your goal is to analyze the latest chapter and update the Master Story Document (MSD) to reflect the evolving plot, character psychology, and world state.

    ### CORE OBJECTIVES:

    1.  **REALISM & PSYCHOLOGY:**
        * Characters are not static. If a character faced a trauma or a triumph in this chapter, update their \`psychology\` and \`narrativeArc\`.
        * Identify **Internal Conflicts**. Does the character want something but fear it? Document this in \`psychology.internalConflict\`.
        * Update \`trustLevel\` and \`tensionLevel\` in relationships. These numbers should fluctuate based on interactions (e.g., a lie discovery drops Trust by 5).

    2.  **THE "NARRATIVE LOG" (Memory Injection):**
        * We are maintaining a detailed history. When creating the \`NarrativeLogEntry\`:
        * **Capture Specifics:** Do not just say "They talked about magic." Say "They discussed the Thaumaturge lineage, and Vivian revealed her grandmother was one."
        * **Track Consequences:** If a character made a promise, lost an item, or received a physical mark, record it in \`consequences\`. This allows future chapters to reference these specific details.

    3.  **WORLD BUILDING & MAGIC:**
        * Did the text mention a rule of magic, a historical event, or a specific location?
        * **Create or Update** entries in \`worldBuilding.loreEntries\`.
        * Be specific about **Rules**. (e.g., "Magic drains stamina," "The bar requires a password").

    4.  **PLOT MOMENTUM:**
        * Update \`globalPlotState\`. Are the stakes higher now?
        * Update \`activeMysteries\`. Did we find a clue? Did a theory get debunked?

    ### HANDLING THE JSON:
    * **Preserve History:** Do not delete old entries in \`narrativeLog\`. Append the new chapter to the end.
    * **Synthesize Profiles:** For \`characters\`, merge new behaviors into their existing profiles. If they acted out of character, note it as a development or a facade.

    ---
    
    **Input Context:**
    <PreviousMasterStoryDocument>
    ${JSON.stringify(previousMasterDoc, null, 2)}
    </PreviousMasterStoryDocument>

    <ChapterAnalysis>
    ${chapterOutline}
    </ChapterAnalysis>
  `;
};

export const createNextMasterDocDirectlyPompt = (
  chapterContent: ChapterData,
  previousMasterDoc?: MasterStoryDocument,
) => {
  return `
    You are the **Lead Narrative Architect** for a complex, character-driven story. 
    Your goal is to analyze the latest chapter and update the Master Story Document (MSD) to reflect the evolving plot, character psychology, and world state.

    ### CORE OBJECTIVES:

    1.  **REALISM & PSYCHOLOGY:**
        * Characters are not static. If a character faced a trauma or a triumph in this chapter, update their \`psychology\` and \`narrativeArc\`.
        * Identify **Internal Conflicts**. Does the character want something but fear it? Document this in \`psychology.internalConflict\`.
        * Update \`trustLevel\` and \`tensionLevel\` in relationships. These numbers should fluctuate based on interactions (e.g., a lie discovery drops Trust by 5).

    2.  **THE "NARRATIVE LOG" (Memory Injection):**
        * We are maintaining a detailed history. When creating the \`NarrativeLogEntry\`:
        * **Capture Specifics:** Do not just say "They talked about magic." Say "They discussed the Thaumaturge lineage, and Vivian revealed her grandmother was one."
        * **Track Consequences:** If a character made a promise, lost an item, or received a physical mark, record it in \`consequences\`. This allows future chapters to reference these specific details.

    3.  **WORLD BUILDING & MAGIC:**
        * Did the text mention a rule of magic, a historical event, or a specific location?
        * **Create or Update** entries in \`worldBuilding.loreEntries\`.
        * Be specific about **Rules**. (e.g., "Magic drains stamina," "The bar requires a password").

    4.  **PLOT MOMENTUM:**
        * Update \`globalPlotState\`. Are the stakes higher now?
        * Update \`activeMysteries\`. Did we find a clue? Did a theory get debunked?

    ### HANDLING THE JSON:
    * **Preserve History:** Do not delete old entries in \`narrativeLog\`. Append the new chapter to the end.
    * **Synthesize Profiles:** For \`characters\`, merge new behaviors into their existing profiles. If they acted out of character, note it as a development or a facade.

    ---
    
    **Input Context:**
    <PreviousMasterStoryDocument>
    ${JSON.stringify(previousMasterDoc, null, 2)}
    </PreviousMasterStoryDocument>

    <NewChapterContent>
    ${chapterContent}
    </NewChapterContent>
  `;
};
