import type {
  ChapterSummary,
  MasterStoryDocument,
} from "@story-generation/types";
import type { ChapterData } from "@/generated/prisma/client.js";

export const createNextMasterDocFromChapterSummaryPrompt = (
  chapterAnalysis: ChapterSummary,
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
    ${JSON.stringify(chapterAnalysis, null, 2)}
    </ChapterAnalysis>
  `;
};

export const createIndirectAnalysisPrompt = (
  chapterData: ChapterData,
  masterStoryDocument?: MasterStoryDocument,
) => {
  return `
    You are the **Lead Narrative Architect** for a complex, character-driven story. 
    Your goal is to analyze the latest chapter and create a chapter analysis to reflect the evolving plot, character psychology, and world state.

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
    <LatestMasterStoryDocument>
    ${JSON.stringify(masterStoryDocument, null, 2)}
    </PreviousMasterStoryDocument>

    <NewChapterData>
    ${JSON.stringify(chapterData, null, 2)}
    </NewChapteData>
  `;
};
