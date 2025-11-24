"use client";

import { useState, useEffect } from 'react';
import { StoryDataHandlers } from '@/features/home/hooks/useStoryData';
import { UserStoryData } from '@story-generation/types';
import { FaPlus, FaTrash, FaChevronDown, FaChevronRight } from 'react-icons/fa';

interface TextInputFormProps {
  activeStory: UserStoryData;
  handlers: StoryDataHandlers;
}

// Module-level storage to persist expanded state across component re-mounts
const expandedChaptersStore = new Map<string, Set<string>>();

export function TextInputForm({ activeStory, handlers }: TextInputFormProps) {
  // Ensure chapters are displayed in order by chapter number
  const sortedChapters = [...activeStory.chapters].sort((a, b) => a.number - b.number);

  // Get or create expanded chapters set for this story
  const storyKey = activeStory.id;
  if (!expandedChaptersStore.has(storyKey)) {
    expandedChaptersStore.set(storyKey, new Set<string>());
  }

  // Track which chapters are expanded (all collapsed by default)
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>(() => {
    const stored = expandedChaptersStore.get(storyKey);
    const initial: Record<string, boolean> = {};
    if (stored) {
      stored.forEach(id => {
        initial[id] = true;
      });
    }
    return initial;
  });

  // Sync state changes to the module-level store
  useEffect(() => {
    const newSet = new Set<string>();
    Object.keys(expandedChapters).forEach(id => {
      if (expandedChapters[id]) {
        newSet.add(id);
      }
    });
    expandedChaptersStore.set(storyKey, newSet);
  }, [expandedChapters, storyKey]);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  return (
    <div className="space-y-6">
      {sortedChapters.map((chapter) => {
        const isExpanded = expandedChapters[chapter.id] || false;
        return (
          <div
            key={chapter.id}
            className="bg-gray-50 rounded-lg relative border border-gray-200 shadow-sm"
          >
            {activeStory.chapters.length > 1 && (
              <button
                type="button"
                onClick={() => handlers.handleRemoveChapter(chapter.id)}
                className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-transform transform hover:scale-110 z-10"
                aria-label="Remove Chapter"
              >
                <FaTrash size={12} />
              </button>
            )}

            <button
              type="button"
              onClick={() => toggleChapter(chapter.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-100 rounded-lg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                <span className="text-sm font-semibold text-gray-700">
                  Chapter {chapter.number}
                  {chapter.title && `: ${chapter.title}`}
                </span>
              </div>
            </button>

            {isExpanded && (
              <div className="p-4 pt-0 space-y-3" onClick={(e) => e.stopPropagation()}>
                <label className="block text-sm font-medium text-gray-700">
                  Chapter Title (Optional)
                  <input
                    type="text"
                    value={chapter.title}
                    onChange={(e) =>
                      handlers.handleChapterChange(
                        chapter.id,
                        'title',
                        e.target.value
                      )
                    }
                    placeholder={`e.g., Chapter ${chapter.number} Title`}
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                  />
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  Chapter Content
                  <textarea
                    value={chapter.content}
                    onChange={(e) =>
                      handlers.handleChapterChange(
                        chapter.id,
                        'content',
                        e.target.value
                      )
                    }
                    rows={10}
                    placeholder="Paste or write your chapter content here..."
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                    required
                  />
                </label>
              </div>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={handlers.handleAddChapter}
        className="w-full flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-md shadow-lg transition-transform transform hover:scale-105"
      >
        <FaPlus className="mr-2" />
        Add Another Chapter
      </button>
    </div>
  );
}