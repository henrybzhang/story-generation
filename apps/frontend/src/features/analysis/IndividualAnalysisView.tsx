'use client';

import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { IndividualAnalysisJobData } from '@story-generation/types';

type IndividualAnalysisViewProps = {
  data: IndividualAnalysisJobData;
  openChapters: Record<string, boolean>;
  onToggle: (key: string) => void;
};

/**
 * Renders the view for Individual analysis
 */
export function IndividualAnalysisView({
  data,
  openChapters,
  onToggle,
}: IndividualAnalysisViewProps) {
  const sortedChapters = data.storyAnalysis.chapterAnalyses.sort(
    (a, b) => a.number - b.number
  );
  return (
    <div className="space-y-4">
      {sortedChapters.map((chapter) => {
        const key = chapter.number.toString();

        return (
          <div
            key={key}
          className="bg-white rounded-xl border border-gray-300 overflow-hidden shadow-md"
        >
          <button
            onClick={() => onToggle(key)}
            className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl font-medium text-gray-800">
                Chapter {chapter.number}
              </span>
              <span className="text-lg font-semibold text-blue-700">
                (Score: {chapter.score.value})
              </span>
            </div>
            {openChapters[key] ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {openChapters[key] && (
            <div className="p-5 bg-white border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-blue-700">
                    Outline
                  </h3>
                  <pre className="bg-gray-50 p-4 rounded-lg text-sm text-gray-800 overflow-x-auto max-h-96 shadow-inner border border-gray-300">
                    <code>
                      {JSON.stringify(chapter.analysis.chapterOutline, null, 2)}
                    </code>
                  </pre>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-purple-700">
                    Characters
                  </h3>
                  <pre className="bg-gray-50 p-4 rounded-lg text-sm text-gray-800 overflow-x-auto max-h-96 shadow-inner border border-gray-300">
                    <code>
                      {JSON.stringify(chapter.analysis.characters, null, 2)}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
        );
      })}
    </div>
  );
}