"use client";

import { StoryDataHandlers } from '@/features/home/hooks/useStoryData';
import { UserStoryData } from '@story-generation/types';
import Link from 'next/link';
import { FaChartBar, FaPlus, FaTrash } from 'react-icons/fa';

interface StoryManagerProps {
  stories: UserStoryData[];
  activeStory: UserStoryData | null;
  activeStoryId: string;
  isLoading: boolean;
  handlers: StoryDataHandlers;
}

export function StoryManager({
  stories,
  activeStory,
  activeStoryId,
  isLoading,
  handlers,
}: StoryManagerProps) {
  return (
    <div className="mb-8 p-4 bg-gray-100 rounded-lg border border-gray-300 space-y-4">
      <div className="flex flex-col sm:flex-row items-end sm:space-x-3">
        {/* Story Name Input */}
        <div className="flex-grow w-full">
          <label
            htmlFor="story-name"
            className="block text-sm font-medium text-gray-700"
          >
            Active Story Name
          </label>
          <input
            type="text"
            id="story-name"
            value={activeStory?.name || ''}
            onChange={handlers.handleStoryNameChange}
            className="mt-1 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={!activeStory || isLoading}
          />
        </div>

        {/* Story Switcher Dropdown */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          <label
            htmlFor="story-select"
            className="block text-sm font-medium text-gray-700 mt-3 sm:mt-0"
          >
            Switch Story
          </label>
          <select
            id="story-select"
            value={activeStoryId}
            onChange={(e) => handlers.handleStorySwitch(e.target.value)}
            disabled={isLoading}
            className="mt-1 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {stories.map((story) => (
              <option key={story.id} value={story.id}>
                {story.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 justify-end">
        <button
          type="button"
          onClick={handlers.handleNewStory}
          className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700"
          aria-label="New Story"
        >
          <FaPlus className="inline mr-2" size={12} />
          New
        </button>
        <Link
          href={`/analysis/${activeStoryId}`}
          className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700"
          aria-label="View Story Analysis"
        >
          <FaChartBar className="inline mr-2" size={12} />
          Analysis
        </Link>
        <button
          type="button"
          onClick={() => handlers.handleDeleteStory(activeStoryId)}
          disabled={stories.length <= 1}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 border border-red-600 rounded-md shadow-sm text-sm font-medium text-white disabled:opacity-50"
          aria-label="Delete Current Story"
        >
          <FaTrash className="inline mr-2" size={12} />
          Delete
        </button>
      </div>
    </div>
  );
}