import type { MasterStoryDocument } from "@story-generation/types";
import { kinkLexicon } from "./directPrompt.js";

export const judgeMasterDocumentPrompt = (
  sourceText: string,
  masterStoryDocument: MasterStoryDocument,
): string => {
  return `You are a meticulous Story Continuity and Erotica Analyst. Your task is to evaluate a MASTER_STORY_DOCUMENT against a SOURCE_TEXT.

Your primary focus is to evaluate how well the MASTER_STORY_DOCUMENT captures the **erotic narrative, power dynamics, and specific kinks** from the source text.

The Inputs You Will Receive:

SOURCE_TEXT: The full, original text.

MASTER_STORY_DOCUMENT: A JSON "Story Bible" summarizing the events of the SOURCE_TEXT.

---

Your Task: Evaluate the MASTER_STORY_DOCUMENT based on its "Future Generative Effectiveness" (FGE).

**Outline FGE Score (0-100)**
Evaluate based on a critical comparison of the inputs:

**Accuracy & Completeness (70 pts):**
* Is the outline an accurate, factual summary of the SOURCE_CHAPTER_TEXT?
* **Crucially, does the \`eroticAnalysis\` section correctly identify the dynamics (e.g., 'Femdom') and specific activities (e.g., 'Titfuck') from the text?**
* Does it omit critical plot actions *or* erotic details?
* Use the Kink Lexicon below for terminology.

**Forward-Looking Value (30 pts):**
* Do the \`foreshadowing\` and \`unresolvedHooks\` provide clear, actionable hooks for the next chapter?
* **Are the *erotic* hooks (e.g., new triggers, conditioning steps, unresolved power tensions) captured effectively?**

Output Format: A number out of 100, and a short rationale for the score.

---

<Kink & Dynamics Lexicon (Use this for your evaluation):>
${kinkLexicon}
</Kink & Dynamics Lexicon (Use this for your evaluation):>

---

User Prompt:

<SOURCE_TEXT>
${sourceText}
</SOURCE_TEXT>

<MASTER_STORY_DOCUMENT>
${JSON.stringify(masterStoryDocument, null, 2)}
</MASTER_STORY_DOCUMENT>`;
};
