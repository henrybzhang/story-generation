"use client";

import { StoryDataHandlers } from '@/features/home/hooks/useStoryData';
import { UserStoryData } from '@story-generation/types';
import { FaPlus, FaTrash } from 'react-icons/fa';

interface TextInputFormProps {
  activeStory: UserStoryData;
  handlers: StoryDataHandlers;
}

export function TextInputForm({ activeStory, handlers }: TextInputFormProps) {
  return (
    <div className="space-y-6">
      {activeStory.chapters.map((chapter) => (
        <div
          key={chapter.number}
          className="p-4 bg-gray-50 rounded-lg relative space-y-3 border border-gray-200 shadow-sm"
        >
          {activeStory.chapters.length > 1 && (
            <button
              type="button"
              onClick={() => handlers.handleRemoveChapter(chapter.number)}
              className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-transform transform hover:scale-110"
              aria-label="Remove Chapter"
            >
              <FaTrash size={12} />
            </button>
          )}
          <label className="block text-sm font-medium text-gray-700">
            Chapter Title (Optional)
            <input
              type="text"
              value={chapter.title}
              onChange={(e) =>
                handlers.handleChapterChange(
                  chapter.number,
                  'title',
                  e.target.value
                )
              }
              placeholder={`e.g., ${chapter.title}`}
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Chapter Content
            <textarea
              value={chapter.content}
              onChange={(e) =>
                handlers.handleChapterChange(
                  chapter.number,
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
      ))}
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