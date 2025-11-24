'use client';

import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { IndirectAnalysisJobData } from '@story-generation/types';

type IndirectAnalysisViewProps = {
  data: IndirectAnalysisJobData;
  openChapters: Record<string, boolean>;
  onToggle: (key: string) => void;
};

/**
 * Renders the view for Individual analysis
 */
export function IndirectAnalysisView({
  data,
  openChapters,
  onToggle,
}: IndirectAnalysisViewProps) {
  const sortedChapters = data.chapterAnalyses.sort(
    (a, b) => a.chapterNumber - b.chapterNumber
  );
  return (
    <div className="space-y-4">
      {sortedChapters.map((chapter) => {
        const key = chapter.chapterNumber.toString();

        return (
          <div
            key={key}
          className="bg-white rounded-xl border border-gray-300 overflow-hidden shadow-md"
        >
          {openChapters[key] && (
            <div className="p-5 bg-white border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-blue-700">
                    Chapter Summary
                  </h3>
                  <pre className="bg-gray-50 p-4 rounded-lg text-sm text-gray-800 overflow-x-auto max-h-96 shadow-inner border border-gray-300">
                    <code>
                      {JSON.stringify(chapter, null, 2)}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
        );
      })}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-purple-700">
          Master Story Document
        </h3>
        <pre className="bg-gray-50 p-4 rounded-lg text-sm text-gray-800 overflow-x-auto max-h-96 shadow-inner border border-gray-300">
          <code>
            {JSON.stringify(data.masterDocument, null, 2)}
          </code>
        </pre>
      </div>
    </div>
  );
}