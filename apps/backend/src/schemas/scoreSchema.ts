import type {
  ChapterOutline,
  MasterStoryDocument,
} from "@story-generation/types";
import { kinkLexicon } from "./directPrompt.js";

export const scorePromptWithMasterStoryDocument = (
  sourceChapterText: string,
  generatedOutline: ChapterOutline, // This outline now includes the 'eroticAnalysis' field
  masterStoryDocument: MasterStoryDocument, // This doc now includes 'powerDynamics'
): string => {
  return `You are a meticulous Story Continuity and Erotica Analyst. Your task is to evaluate a GENERATED_OUTLINE against a SOURCE_CHAPTER_TEXT, using a MASTER_STORY_DOCUMENT for context.

The Inputs You Will Receive:

SOURCE_CHAPTER_TEXT: The full, original text for the current chapter.

MASTER_STORY_DOCUMENT: The JSON "Story Bible" as it existed before this chapter. This provides context on subplots, themes, character states, and **overall power dynamics**.

GENERATED_OUTLINE: A JSON outline summarizing the events of the SOURCE_CHAPTER_TEXT, which includes a specific \`eroticAnalysis\` section.

---

Your Task: You must provide a "Future Generative Effectiveness" (FGE) score, evaluating how well this outline prepares for writing the *next* chapter, **with a special focus on tracking the erotic narrative.**

Part 1: Outline FGE Score (0-100)
Evaluate the GENERATED_OUTLINE based on the following criteria. Use the Kink Lexicon below for terminology.

**Erotic Narrative Accuracy (40 pts):**
* How accurately and completely does the \`eroticAnalysis\` section capture the scenes from the SOURCE_CHAPTER_TEXT?
* Did it correctly identify the **Core Dynamics** (e.g., Femdom, Mind Control) and **Specific Activities** (e.g., Spanking, Trigger Play) present?
* Is the \`powerShift\` analysis insightful and reflective of the text?

**Contextual Relevance (30 pts):**
* Given the MASTER_STORY_DOCUMENT, did this outline correctly identify how the chapter's events (both plot and erotic) advance the existing \`powerDynamics\`, \`activeSubplots\`, and \`characterSheets\`?
* Did it correctly update \`characterDevelopment\` for the characters involved in the erotic scenes?

**Forward-Looking Value (30 pts):**
* Do the \`unresolvedHooks\` and \`foreshadowing\` sections provide clear, actionable hooks for the *next* chapter, especially regarding the evolving power dynamics, conditioning, or erotic-plot-points?

Output Format: A number out of 100, and a short rationale for the score.

---

<Kink & Dynamics Lexicon (Use this for your evaluation):>
${kinkLexicon}
</Kink & Dynamics Lexicon (Use this for your evaluation):>

---

User Prompt:

<SOURCE_CHAPTER_TEXT>
${sourceChapterText}
</SOURCE_CHAPTER_TEXT>

<MASTER_STORY_DOCUMENT (PRE-CHAPTER)>
${JSON.stringify(masterStoryDocument, null, 2)}
</MASTER_STORY_DOCUMENT (PRE-CHAPTER)>

<GENERATED_OUTLINE>
${JSON.stringify(generatedOutline, null, 2)}
</GENERATED_OUTLINE>`;
};

export const scorePrompt = (
  sourceChapterText: string,
  generatedOutline: ChapterOutline,
): string => {
  return `You are a meticulous Story Continuity and Erotica Analyst. Your task is to evaluate a GENERATED_OUTLINE against a SOURCE_CHAPTER_TEXT.

Your primary focus is to evaluate how well the outline captures the **erotic narrative, power dynamics, and specific kinks** from the source text.

The Inputs You Will Receive:

SOURCE_CHAPTER_TEXT: The full, original text for the current chapter.

GENERATED_OUTLINE: A JSON outline summarizing the events of the SOURCE_CHAPTER_TEXT. This outline includes an \`eroticAnalysis\` section.

---

Your Task: Evaluate the GENERATED_OUTLINE based on its "Future Generative Effectiveness" (FGE).

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

<SOURCE_CHAPTER_TEXT>
${sourceChapterText}
</SOURCE_CHAPTER_TEXT>

<GENERATED_OUTLINE>
${JSON.stringify(generatedOutline, null, 2)}
</GENERATED_OUTLINE>`;
};
