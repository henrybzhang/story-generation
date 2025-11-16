export type InputType = 'text' | 'link' | 'file';

export interface Chapter {
  number: number;
  title: string;
  content: string;
}

export interface Story {
  id: string; // This will be our database key
  name: string;
  chapters: Chapter[];
}

// Key for storing the active story ID in our app-state store
export const ACTIVE_STORY_ID_KEY = 'activeStoryId';