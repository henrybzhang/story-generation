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
  const handleChapterToggle = (chapterNumber: number) => {
    const newSelectedChapters = [...selectedChapters];
    const chapterIndex = newSelectedChapters.indexOf(chapterNumber);

    if (chapterIndex > -1) {
      // Deselecting a chapter
      // To enforce sequential selection, if a user deselects a chapter,
      // all subsequent chapters are also deselected.
      const chaptersToDeselect = newSelectedChapters.filter(
        (num) => num >= chapterNumber
      );
      onSelectedChaptersChange(
        newSelectedChapters.filter((num) => !chaptersToDeselect.includes(num))
      );
    } else {
      // Selecting a chapter
      // To enforce sequential selection, if a user selects a chapter,
      // all previous chapters that are not yet selected are also selected.
      const chaptersToSelect = [];
      for (let i = 1; i <= chapterNumber; i++) {
        if (!newSelectedChapters.includes(i)) {
          chaptersToSelect.push(i);
        }
      }
      onSelectedChaptersChange([...newSelectedChapters, ...chaptersToSelect].sort((a, b) => a - b));
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Select Chapters for Analysis</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {chapters.map((chapter) => (
          <div key={chapter.number} className="flex items-center">
            <input
              type="checkbox"
              id={`chapter-${chapter.number}`}
              name={`chapter-${chapter.number}`}
              checked={selectedChapters.includes(chapter.number)}
              onChange={() => handleChapterToggle(chapter.number)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor={`chapter-${chapter.number}`}
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
