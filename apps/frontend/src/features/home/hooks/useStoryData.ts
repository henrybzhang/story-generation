import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ACTIVE_STORY_ID_KEY } from '@/types/story';
import { UserChapterData, UserStoryData } from '@story-generation/types';
import * as storyApi from '@/lib/storyApi';

export type StoryDataHandlers = {
  handleStorySwitch: (newId: string) => void;
  handleNewStory: () => void;
  handleDeleteStory: (storyId: string) => void;
  handleStoryNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddChapter: () => void;
  handleRemoveChapter: (chapterId: string) => void;
  handleChapterChange: (
    chapterId: string,
    field: keyof UserChapterData,
    value: string
  ) => void;
};

export function useStoryData() {
  const queryClient = useQueryClient();
  const [activeStoryId, setActiveStoryId] = useState<string>('');

  const { data: rawStories = [], isLoading } = useQuery<UserStoryData[]>({
    queryKey: ['stories'],
    queryFn: storyApi.fetchStories,
    staleTime: 1000 * 60 * 60 * 8, // 8 hours
  });

  // Ensure all stories have their chapters sorted by number
  const stories = useMemo(() => {
    return rawStories.map(story => ({
      ...story,
      chapters: [...story.chapters].sort((a, b) => a.number - b.number),
    }));
  }, [rawStories]);

  useEffect(() => {
    if (stories.length > 0) {
      const storedActiveId = localStorage.getItem(ACTIVE_STORY_ID_KEY);
      if (storedActiveId && stories.find((s) => s.id === storedActiveId)) {
        setActiveStoryId(storedActiveId);
      } else {
        const newActiveId = stories[0].id;
        setActiveStoryId(newActiveId);
        localStorage.setItem(ACTIVE_STORY_ID_KEY, newActiveId);
      }
    }
  }, [stories]);

  const activeStory = useMemo(() => {
    const story = stories.find((s) => s.id === activeStoryId);
    if (!story) {
      return null;
    }
    // Return a new story object with chapters sorted to ensure correct render order
    return {
      ...story,
      chapters: [...story.chapters].sort((a, b) => a.number - b.number),
    };
  }, [stories, activeStoryId]);

  const handleStorySwitch = useCallback((newId: string) => {
    setActiveStoryId(newId);
    localStorage.setItem(ACTIVE_STORY_ID_KEY, newId);
  }, []);

  const createStoryMutation = useMutation({
    mutationFn: (newName: string) => {
      const newChapter = {
        id: `temp-${Date.now()}-${Math.random()}`,
        number: 1,
        title: 'Chapter 1',
        content: '',
      };
      // We only send what the backend expects
      const { id, ...chapterPayload } = newChapter;
      return storyApi.createStory(newName, [chapterPayload]);
    },
    onSuccess: (newStory) => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      handleStorySwitch(newStory.id);
    },
  });

  const deleteStoryMutation = useMutation({
    mutationFn: async (storyId: string) => {
      await storyApi.deleteStory(storyId);
      await storyApi.deleteAnalysis(storyId); // Also delete associated analysis
      return storyId;
    },
    onSuccess: (deletedStoryId) => {
      const newStories = stories.filter((s) => s.id !== deletedStoryId);
      if (activeStoryId === deletedStoryId && newStories.length > 0) {
        handleStorySwitch(newStories[0].id);
      }
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
  });

  const updateStoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserStoryData> }) =>
      storyApi.updateStory(id, data),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['stories'] });
      const previousStories = queryClient.getQueryData<UserStoryData[]>(['stories']);
      queryClient.setQueryData<UserStoryData[]>(['stories'], (old) =>
        old
          ? old.map((story) =>
              story.id === variables.id ? { ...story, ...variables.data } : story
            )
          : []
      );
      return { previousStories };
    },
    onError: (err, variables, context) => {
      if (context?.previousStories) {
        queryClient.setQueryData(['stories'], context.previousStories);
      }
    },
    // On success, replace the cached story with the server-returned story so
    // temporary chapter ids created on the client are replaced by backend ids.
    onSuccess: (updatedStory: UserStoryData) => {
      queryClient.setQueryData<UserStoryData[]>(['stories'], (old) =>
        old
          ? old.map((s) => (s.id === updatedStory.id ? {
              ...updatedStory,
              chapters: [...(updatedStory.chapters || [])].sort((a, b) => a.number - b.number),
            } : s))
          : [updatedStory]
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
  });

  const handleNewStory = useCallback(() => {
    createStoryMutation.mutate(`New Story ${stories.length + 1}`);
  }, [stories.length, createStoryMutation]);

  const handleDeleteStory = useCallback(
    (storyId: string) => {
      if (stories.length <= 1) {
        alert('Cannot delete the last story.');
        return;
      }
      deleteStoryMutation.mutate(storyId);
    },
    [stories.length, deleteStoryMutation]
  );

  const handleStoryNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!activeStory) return;
      updateStoryMutation.mutate({
        id: activeStory.id,
        data: { name: e.target.value },
      });
    },
    [activeStory, updateStoryMutation]
  );

  const updateActiveStoryChapters = useCallback(
    (updatedChapters: UserChapterData[]) => {
      if (!activeStory) return;
      // Ensure chapters are sorted by number and renumbered sequentially
      const cleaned = [...updatedChapters]
        .sort((a, b) => a.number - b.number)
        .map((c, index) => ({ ...c, number: index + 1 }));

      updateStoryMutation.mutate({
        id: activeStory.id,
        data: { chapters: cleaned },
      });
    },
    [activeStory, updateStoryMutation]
  );

  const handleAddChapter = useCallback(() => {
    if (!activeStory) return;
    const nextNumber = activeStory.chapters && activeStory.chapters.length > 0
      ? Math.max(...activeStory.chapters.map((c) => c.number)) + 1
      : 1;
    const newChapter: UserChapterData = {
      id: `temp-${Date.now()}-${Math.random()}`,
      number: nextNumber,
      title: `Chapter ${nextNumber}`,
      content: '',
    };
    updateActiveStoryChapters([...activeStory.chapters, newChapter]);
  }, [activeStory, updateActiveStoryChapters]);

  const handleRemoveChapter = useCallback(
    (chapterId: string) => {
      if (!activeStory) return;
      // Ensure we operate on sorted chapters, remove the one with the id,
      // then renumber sequentially starting at 1.
      const newChapters = [...activeStory.chapters]
        .sort((a, b) => a.number - b.number)
        .filter((c) => c.id !== chapterId)
        .map((c, index) => ({ ...c, number: index + 1 }));
      updateActiveStoryChapters(newChapters);
    },
    [activeStory, updateActiveStoryChapters]
  );

  const handleChapterChange = useCallback(
    (chapterId: string, field: keyof UserChapterData, value: string) => {
      if (!activeStory) return;

      // If changing title or content, don't renumber - just update the field
      if (field === 'title' || field === 'content') {
        const newChapters = activeStory.chapters.map((c) =>
          c.id === chapterId ? { ...c, [field]: value } : c
        );
        updateStoryMutation.mutate({
          id: activeStory.id,
          data: { chapters: newChapters },
        });
      } else {
        // For other fields (like number), use the full renumbering logic
        const newChapters = activeStory.chapters.map((c) =>
          c.id === chapterId ? { ...c, [field]: value } : c
        );
        updateActiveStoryChapters(newChapters);
      }
    },
    [activeStory, updateActiveStoryChapters, updateStoryMutation]
  );

  return {
    stories,
    activeStory,
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