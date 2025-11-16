import { useState, useEffect, useMemo, useCallback } from 'react';
import { Story, Chapter, ACTIVE_STORY_ID_KEY } from '@/types/story';
import {
  getStoriesFromDB,
  saveStoryToDB,
  deleteStoryFromDB,
  getAppStateFromDB,
  saveAppStateToDB,
  deleteAnalaysisResultFromDB,
} from '@/lib/db';

export function useStoryData() {
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStoryId, setActiveStoryId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true); // Tracks initial load

  // Effect to load stories from IndexedDB on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const storedStories = await getStoriesFromDB();

      if (storedStories.length > 0) {
        setStories(storedStories);
        const storedActiveId = await getAppStateFromDB(ACTIVE_STORY_ID_KEY);
        
        if (storedActiveId && storedStories.find(s => s.id === storedActiveId)) {
          setActiveStoryId(storedActiveId);
        } else {
          // Default to first story
          setActiveStoryId(storedStories[0].id);
          await saveAppStateToDB(ACTIVE_STORY_ID_KEY, storedStories[0].id);
        }
      } else {
        // Create a default first story if DB is empty
        const newStory: Story = {
          id: `story-${Date.now()}`,
          name: 'My First Story',
          chapters: [{ number: 1, title: 'Chapter 1', content: '' }],
        };
        await saveStoryToDB(newStory); // Save to DB
        await saveAppStateToDB(ACTIVE_STORY_ID_KEY, newStory.id); // Save active ID
        setStories([newStory]);
        setActiveStoryId(newStory.id);
      }
      setIsLoading(false);
    }

    loadData();
  }, []);

  // Get the currently active story object
  const activeStory = useMemo(() => {
    return stories.find(s => s.id === activeStoryId);
  }, [stories, activeStoryId]);

  const handleStorySwitch = useCallback(async (newId: string) => {
    setActiveStoryId(newId);
    await saveAppStateToDB(ACTIVE_STORY_ID_KEY, newId);
  }, []);

  const handleNewStory = useCallback(async () => {
    const newStory: Story = {
      id: `story-${Date.now()}`,
      name: `New Story ${stories.length + 1}`,
      chapters: [{ number: 1, title: 'Chapter 1', content: '' }],
    };
    
    await saveStoryToDB(newStory); // Save to DB
    const newStories = [...stories, newStory];
    setStories(newStories);
    await handleStorySwitch(newStory.id); // Switch to the new story
  }, [stories, handleStorySwitch]);

  const handleDeleteStory = useCallback(async (storyId: string) => {
    if (stories.length <= 1) {
      alert('Cannot delete the last story.');
      return;
    }
    
    await deleteStoryFromDB(storyId); // Delete from DB
    await deleteAnalaysisResultFromDB(storyId); // Delete associated result
    
    const newStories = stories.filter(s => s.id !== storyId);
    setStories(newStories);

    // If we deleted the active story, switch to the first remaining one
    if (activeStoryId === storyId) {
      await handleStorySwitch(newStories[0].id);
    }
  }, [stories, activeStoryId, handleStorySwitch]);

  const handleStoryNameChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeStory) return;
    const newName = e.target.value;
    
    const updatedStory = { ...activeStory, name: newName };
    
    const newStories = stories.map(s =>
      s.id === activeStoryId ? updatedStory : s
    );
    
    setStories(newStories);
    await saveStoryToDB(updatedStory); // Save updated story to DB
  }, [activeStory, activeStoryId, stories]);

  // --- Chapter Handlers (now async) ---
  
  // Helper to save chapter changes
  const updateActiveStory = async (updatedChapters: Chapter[]) => {
    if (!activeStory) return;
    
    const updatedStory = { ...activeStory, chapters: updatedChapters };
    
    const newStories = stories.map(s =>
      s.id === activeStoryId ? updatedStory : s
    );
    
    setStories(newStories);
    await saveStoryToDB(updatedStory); // Persist the change
  };

  const handleAddChapter = useCallback(async () => {
    if (!activeStory) return;

    const newId =
      activeStory.chapters.length > 0
        ? Math.max(...activeStory.chapters.map(c => c.number)) + 1
        : 1;
    const newChapter = {
      number: newId,
      title: `Chapter ${activeStory.chapters.length + 1}`,
      content: '',
    };
    
    await updateActiveStory([...activeStory.chapters, newChapter]);
  }, [activeStory]);

  const handleRemoveChapter = useCallback(async (chapterNumber: number) => {
    if (!activeStory) return;
    
    const newChapters = activeStory.chapters.filter(
      chapter => chapter.number !== chapterNumber
    );
    
    await updateActiveStory(newChapters);
  }, [activeStory]);

  const handleChapterChange = useCallback(async (
    chapterNumber: number,
    field: keyof Chapter,
    value: string
  ) => {
    if (!activeStory) return;

    const newChapters = activeStory.chapters.map(chapter =>
      chapter.number === chapterNumber ? { ...chapter, [field]: value } : chapter
    );
    
    await updateActiveStory(newChapters);
  }, [activeStory]);

  return {
    stories,
    activeStory,
    activeStoryId,
    isLoading, // Renamed to not conflict with submission loading
    handlers: {
      handleStorySwitch,
      handleNewStory,
      handleDeleteStory,
      handleStoryNameChange,
      handleAddChapter,
      handleRemoveChapter,
      handleChapterChange,
    }
  };
}