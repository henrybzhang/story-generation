import { UserChapterData } from '@story-generation/types';

interface ChapterSelectionProps {
  chapters: UserChapterData[];
  selectedChapters: number[];
  onSelectedChaptersChange: (selectedChapters: number[]) => void;
}

export function ChapterSelection({
  chapters,
  selectedChapters,
  onSelectedChaptersChange,
}: ChapterSelectionProps) {
  // Sort chapters by number to ensure correct display order
  const sortedChapters = [...chapters].sort((a, b) => a.number - b.number);

  const handleChapterToggle = (chapterNumber: number) => {
    const isSelected = selectedChapters.includes(chapterNumber);

    if (isSelected) {
      // Deselecting a chapter
      // To enforce sequential selection, if a user deselects a chapter,
      // all subsequent chapters are also deselected.
      const newSelection = selectedChapters.filter((num) => num < chapterNumber);
      onSelectedChaptersChange(newSelection);
    } else {
      // Selecting a chapter
      // To enforce sequential selection starting from chapter 1,
      // select all chapters from 1 to the clicked chapter number.
      const newSelection = [];
      for (let i = 1; i <= chapterNumber; i++) {
        newSelection.push(i);
      }
      onSelectedChaptersChange(newSelection);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Select Chapters for Analysis</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {sortedChapters.map((chapter) => (
          <div key={chapter.id} className="flex items-center">
            <input
              type="checkbox"
              id={`chapter-${chapter.id}`}
              name={`chapter-${chapter.id}`}
              checked={selectedChapters.includes(chapter.number)}
              onChange={() => handleChapterToggle(chapter.number)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor={`chapter-${chapter.id}`}
              className="ml-3 block text-sm font-medium text-gray-700"
            >
              Chapter {chapter.number}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
