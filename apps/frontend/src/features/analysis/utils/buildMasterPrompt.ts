import { AnalysisJobData } from '@story-generation/types';

/**
 * Builds the master prompt string from the analysis data.
 * Includes the master story document from the most recent chapter
 * and summaries of the 3 most recent chapter analyses.
 */
export function buildMasterPrompt(
  analysis: AnalysisJobData
): string {
  console.log(analysis)
  let context = `[SYSTEM]\nYou are a creative story writer. Below is the full context for a story-in-progress. Your task is to continue the story based on the user's direction.\n\n`;

  // Get all chapter analyses sorted by chapter number
  const sortedChapters = [...analysis.chapterAnalyses].sort(
    (a, b) => a.chapterNumber - b.chapterNumber,
  );

  if (sortedChapters.length === 0) {
    return context + '[No chapter analyses available]\n';
  }

  // Add the master story document
  context += `[MASTER STORY DOCUMENT]\n`;
  context += `This is the comprehensive story context built from all analyzed chapters.\n\n`;
  context += JSON.stringify(analysis.masterDocument, null, 2);
  context += `\n\n---\n\n`;

  // Get the 3 most recent chapter analyses
  const recentChapters = sortedChapters.slice(-3);
  
  context += `[RECENT CHAPTER SUMMARIES]\n`;
  context += `Below are summaries of the ${recentChapters.length} most recent chapter(s):\n\n`;

  for (const chapter of recentChapters) {
    context += `[CHAPTER ${chapter.chapterNumber}]\n`;
    context += JSON.stringify(chapter, null, 2);
    context += `\n\n---\n\n
    ## Story Philosophy
- This is erotic fiction with substantive plot and realistic characters
- Tone is playful, sensual, and engaging - not dark or gritty
- Characters drive the story through desires, decisions, and relationships
- Erotic content emerges naturally from character dynamics and plot
- Every scene serves multiple purposes (character, plot, relationships, eroticism)
- Pacing feels natural - not every chapter requires explicit content

## Writing Style
- Clear, evocative language over purple prose
- Show emotion through action and dialogue, not just telling
- Engage multiple senses for immersion
- Balance introspection with external action
- Let important moments breathe - don't rush
- Maintain narrative momentum while allowing character development`;
  }

  return context;
}