import { UserChapterData, UserStoryData } from '@story-generation/types';
import { BASE_URL } from './api';

type UserChapterDataNoID = Omit<UserChapterData, 'id'>;

/**
 * A robust helper for handling fetch responses.
 * It handles both successful (ok: true) and error (ok: false) responses.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json();
  }

  let errorMessage = `API error: ${response.status} ${response.statusText}`;
  
  try {
    const err = await response.json();
    if (err.message) {
      errorMessage = err.message;
    }
  } catch (e) {
    console.warn("Could not parse error response as JSON", e);
  }

  throw new Error(errorMessage);
}

/**
 * Fetches all stories for the user
 */
export async function fetchStories(): Promise<UserStoryData[]> {
  const response = await fetch(`${BASE_URL}/stories`);
  return handleResponse<UserStoryData[]>(response);
}

/**
 * Creates a new story
 */
export async function createStory(
  name: string,
  chapters: UserChapterDataNoID[]
): Promise<UserStoryData> {
  const response = await fetch(`${BASE_URL}/stories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, chapters }),
  });
  return handleResponse<UserStoryData>(response);
}

/**
 * Updates an existing story (e.g., name or chapters)
 */
export async function updateStory(
  storyId: string,
  updates: Partial<UserStoryData>
): Promise<UserStoryData> {
  const response = await fetch(`${BASE_URL}/stories/${storyId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return handleResponse<UserStoryData>(response);
}

/**
 * Deletes a story
 */
export async function deleteStory(storyId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/stories/${storyId}`, {
    method: 'DELETE',
  });
  // Delete doesn't return content, just check for "ok" status
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to delete story');
  }
}

/**
 * Deletes the analysis associated with a story
 * (Assuming this is a separate endpoint; a good backend
 * might handle this automatically with a cascading delete)
 */
export async function deleteAnalysis(storyId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/analysis/${storyId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to delete analysis');
  }
}