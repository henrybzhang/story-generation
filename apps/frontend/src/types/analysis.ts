import { IndividualStoryAnalysis, ContextualStoryAnalysis } from '@story-generation/types';

/**
 * The complete analysis data object returned from the backend
 * and stored in session storage.
 */
export type FullAnalysisResultData = {
  /**
   * Contains chapter-by-chapter analysis, where each key
   * is a chapter identifier (e.g., "chapter_1").
   */
  individual: IndividualStoryAnalysis;
  /**
   * Contains chapter-by-chapter analysis with a running
   * 'masterStoryDocument', where each key is a chapter identifier.
   */
  contextual: ContextualStoryAnalysis;
};