// hooks/useStoryData.ts

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ACTIVE_STORY_ID_KEY } from '@/types/story';
import { UserChapterData, UserStoryData } from '@story-generation/types';
import * as storyApi from '@/lib/storyApi'; // Import the new API module

export type StoryDataHandlers = {
  handleStorySwitch: (newId: string) => Promise<void>;
  handleNewStory: () => Promise<void>;
  handleDeleteStory: (storyId: string) => Promise<void>;
  handleStoryNameChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  handleAddChapter: () => Promise<void>;
  handleRemoveChapter: (chapterNumber: number) => Promise<void>;
  handleChapterChange: (
    chapterNumber: number,
    field: keyof UserChapterData,
    value: string
  ) => Promise<void>;
};

export function useStoryData() {
  const [stories, setStories] = useState<UserStoryData[]>([]);
  const [activeStoryId, setActiveStoryId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true); // Tracks initial load

  // Effect to load stories from backend on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const storedStories = await storyApi.fetchStories();

        if (storedStories.length > 0) {
          setStories(storedStories);
          const storedActiveId = localStorage.getItem(ACTIVE_STORY_ID_KEY);

          if (
            storedActiveId &&
            storedStories.find((s) => s.id === storedActiveId)
          ) {
            setActiveStoryId(storedActiveId);
          } else {
            // Default to first story
            setActiveStoryId(storedStories[0].id);
            localStorage.setItem(ACTIVE_STORY_ID_KEY, storedStories[0].id);
          }
        } else {
          // Create a default first story if backend has none
          const newStory = await storyApi.createStory('My First Story', [
            { number: 1, title: 'Chapter 1', content: '' },
          ]);
          localStorage.setItem(ACTIVE_STORY_ID_KEY, newStory.id);
          setStories([newStory]);
          setActiveStoryId(newStory.id);
        }
      } catch (error) {
        console.error('Failed to load stories:', error);
        // TODO: Set an error state to show in the UI
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Get the currently active story object
  const activeStory = useMemo(() => {
    return stories.find((s) => s.id === activeStoryId);
  }, [stories, activeStoryId]);

  // --- HANDLERS ---

  const handleStorySwitch = useCallback(async (newId: string) => {
    setActiveStoryId(newId);
    // User preference is saved locally, not a backend call
    localStorage.setItem(ACTIVE_STORY_ID_KEY, newId);
  }, []);

  const handleNewStory = useCallback(async () => {
    try {
      const newStory = await storyApi.createStory(
        `New Story ${stories.length + 1}`,
        [{ number: 1, title: 'Chapter 1', content: '' }]
      );

      // Update state *after* successful API call
      const newStories = [...stories, newStory];
      setStories(newStories);
      await handleStorySwitch(newStory.id); // Switch to the new story
    } catch (error) {
      console.error('Failed to create new story:', error);
    }
  }, [stories, handleStorySwitch]);

  const handleDeleteStory = useCallback(
    async (storyId: string) => {
      if (stories.length <= 1) {
        alert('Cannot delete the last story.');
        return;
      }

      try {
        await storyApi.deleteStory(storyId);
        // Also delete associated analysis
        await storyApi.deleteAnalysis(storyId);

        // Update state *after* successful deletion
        const newStories = stories.filter((s) => s.id !== storyId);
        setStories(newStories);

        // If we deleted the active story, switch to the first remaining one
        if (activeStoryId === storyId) {
          await handleStorySwitch(newStories[0].id);
        }
      } catch (error) {
        console.error('Failed to delete story:', error);
      }
    },
    [stories, activeStoryId, handleStorySwitch]
  );

  const handleStoryNameChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!activeStory) return;
      const newName = e.target.value;

      // Optimistically update the UI for responsiveness
      const oldStories = stories;
      const newStoriesOptimistic = stories.map((s) =>
        s.id === activeStoryId ? { ...s, name: newName } : s
      );
      setStories(newStoriesOptimistic);

      try {
        // Debounce or save on blur in a real app, but for now, save immediately
        await storyApi.updateStory(activeStory.id, { name: newName });
        // The backend might return an updated object (e.g., with updatedAt)
        // For now, we assume the optimistic update is correct
      } catch (error) {
        console.error('Failed to save story name:', error);
        // Rollback on error
        setStories(oldStories);
        alert('Error: Could not save story name.');
      }
    },
    [activeStory, activeStoryId, stories]
  );

  // --- Chapter Handlers ---

  // Helper to update the story's chapters on the backend
  const updateActiveStoryChapters = useCallback(
    async (updatedChapters: UserChapterData[]) => {
      if (!activeStory) return;

      const oldStories = stories;
      // Optimistic update for snappy UI
      const updatedStoryOptimistic = {
        ...activeStory,
        chapters: updatedChapters,
      };
      const newStoriesOptimistic = stories.map((s) =>
        s.id === activeStoryId ? updatedStoryOptimistic : s
      );
      setStories(newStoriesOptimistic);

      try {
        // Persist the change to the backend
        await storyApi.updateStory(activeStory.id, {
          chapters: updatedChapters,
        });
      } catch (error) {
        console.error('Failed to update chapters:', error);
        // Rollback
        setStories(oldStories);
        alert('Error: Could not save chapter changes.');
      }
    },
    [activeStory, activeStoryId, stories]
  );

  const handleAddChapter = useCallback(async () => {
    if (!activeStory) return;

    const newId =
      activeStory.chapters.length > 0
        ? Math.max(...activeStory.chapters.map((c) => c.number)) + 1
        : 1;
    const newChapter = {
      number: newId,
      title: `Chapter ${activeStory.chapters.length + 1}`,
      content: '',
    };

    await updateActiveStoryChapters([...activeStory.chapters, newChapter]);
  }, [activeStory, updateActiveStoryChapters]);

  const handleRemoveChapter = useCallback(
    async (chapterNumber: number) => {
      if (!activeStory) return;

      const newChapters = activeStory.chapters.filter(
        (chapter) => chapter.number !== chapterNumber
      );

      await updateActiveStoryChapters(newChapters);
    },
    [activeStory, updateActiveStoryChapters]
  );

  const handleChapterChange = useCallback(
    async (
      chapterNumber: number,
      field: keyof UserChapterData,
      value: string
    ) => {
      if (!activeStory) return;

      const newChapters = activeStory.chapters.map((chapter) =>
        chapter.number === chapterNumber
          ? { ...chapter, [field]: value }
          : chapter
      );

      await updateActiveStoryChapters(newChapters);
    },
    [activeStory, updateActiveStoryChapters]
  );

  return {
    stories,
    activeStory: activeStory || null, // Ensure return is null if not found
    activeStoryId,
    isLoading,
    handlers: {
      handleStorySwitch,
      handleNewStory,
      handleDeleteStory,
      handleStoryNameChange,
      handleAddChapter,
      handleRemoveChapter,
      handleChapterChange,
    },
  };
}