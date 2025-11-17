import { AnalysisJobData, ContextualStoryAnalysis, IndividualStoryAnalysis } from '@story-generation/types';

/**
 * Builds the master prompt string from the analysis data.
 */
export function buildMasterPrompt(
  analysis: AnalysisJobData
): string {
  let context = `[SYSTEM]\nYou are a creative story writer. Below is the full context for a story-in-progress. Your task is to continue the story based on the user's direction.\n\n`;

  if (analysis.method === 'individual') {
    // 1. Assert the type of storyAnalysis based on the method
    const storyAnalysis = analysis.storyAnalysis as IndividualStoryAnalysis;
    context += `[STORY CONTEXT SO FAR (Individual)]\n---\n`;

    // 2. Use the correctly-typed variable
    const sortedChapters = [...storyAnalysis].sort(
      (a, b) => a.number - b.number,
    );
    for (const chapter of sortedChapters) {
      context += `[CHAPTER ${chapter.number}]\n`;
      // 3. No 'as' needed here, chapter.analysisResults is already the correct type
      const chapterAnalysis = chapter.analysisResults;
      context += `OUTLINE:\n${JSON.stringify(
        chapterAnalysis.analysis.chapterOutline,
        null,
        2,
      )}\n\n`;
      context += `CHARACTERS:\n${JSON.stringify(
        chapterAnalysis.analysis.characters,
        null,
        2,
      )}\n\n`;
      context += `---\n`;
    }
  } else if (analysis.method === 'contextual') {
    // 1. Assert the type of storyAnalysis based on the method
    const storyAnalysis = analysis.storyAnalysis as ContextualStoryAnalysis;

    // 2. Get the last chapter (this is an object from the array, or undefined)
    const lastChapter = [...storyAnalysis]
      .sort((a, b) => b.number - a.number)
      .at(0);

    // 3. Check for the chapter AND its results, then access the property correctly
    if (!lastChapter || !lastChapter.analysisResults) {
      return 'Error: Could not find masterStoryDocument in the latest chapter.';
    }

    context += `[MASTER STORY DOCUMENT]\n`;
    // 4. Access the masterStoryDocument from the (now correctly typed) analysisResults
    context += JSON.stringify(
      lastChapter.analysisResults.masterStoryDocument,
      null,
      2,
    );
  } else {
    return 'Error: Unknown analysis method.';
  }

  return context;
}