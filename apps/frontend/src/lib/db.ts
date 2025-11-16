import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Story, ACTIVE_STORY_ID_KEY } from '@/types/story';

const DB_NAME = 'StoryAnalyzerDB';
const DB_VERSION = 1;

const STORIES_STORE = 'stories';
const RESULTS_STORE = 'analysisResults';
const APP_STATE_STORE = 'appState';

// Define the database schema
interface StoryAnalyzerDB extends DBSchema {
  [STORIES_STORE]: {
    key: string;
    value: Story;
  };
  [RESULTS_STORE]: {
    key: string; // storyId
    value: any; // The analysis result
  };
  [APP_STATE_STORE]: {
    key: string; // e.g., 'activeStoryId'
    value: any;
  };
}

let dbPromise: Promise<IDBPDatabase<StoryAnalyzerDB>>;

const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<StoryAnalyzerDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create stores if they don't exist
        if (!db.objectStoreNames.contains(STORIES_STORE)) {
          db.createObjectStore(STORIES_STORE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(RESULTS_STORE)) {
          db.createObjectStore(RESULTS_STORE);
        }
        if (!db.objectStoreNames.contains(APP_STATE_STORE)) {
          db.createObjectStore(APP_STATE_STORE);
        }
      },
    });
  }
  return dbPromise;
};

// --- Story Functions ---

export const getStoriesFromDB = async (): Promise<Story[]> => {
  const db = await initDB();
  return db.getAll(STORIES_STORE);
};

export const saveStoryToDB = async (story: Story): Promise<string> => {
  const db = await initDB();
  return db.put(STORIES_STORE, story);
};

export const deleteStoryFromDB = async (storyId: string): Promise<void> => {
  const db = await initDB();
  return db.delete(STORIES_STORE, storyId);
};

// --- Analysis Result Functions ---

export const saveAnalysisResultToDB = async (storyId: string, result: any): Promise<string> => {
  const db = await initDB();
  return db.put(RESULTS_STORE, result, storyId);
};

export const getAnalysisResultFromDB = async (storyId: string): Promise<any> => {
  const db = await initDB();
  return db.get(RESULTS_STORE, storyId);
};

export const deleteAnalaysisResultFromDB = async (storyId: string): Promise<void> => {
  const db = await initDB();
  return db.delete(RESULTS_STORE, storyId);
};

// --- App State Functions (for active ID) ---

export const getAppStateFromDB = async (key: string): Promise<any> => {
  const db = await initDB();
  return db.get(APP_STATE_STORE, key);
};

export const saveAppStateToDB = async (key: string, value: any): Promise<string> => {
  const db = await initDB();
  return db.put(APP_STATE_STORE, value, key);
};