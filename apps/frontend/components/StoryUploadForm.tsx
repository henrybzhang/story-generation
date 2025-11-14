'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaFileUpload, FaLink, FaFont, FaPlus, FaTrash } from 'react-icons/fa';
import { LoadingSpinner } from './LoadingSpinner';

type InputType = 'text' | 'link' | 'file';

interface Chapter {
  number: number;
  title: string;
  content: string;
}

export default function StoryUploadForm() {
  const [inputType, setInputType] = useState<InputType>('text');
  const [link, setLink] = useState('');
  const [chapters, setChapters] = useState<Chapter[]>([
    { number: 1, title: 'Chapter 1', content: '' },
  ]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAddChapter = () => {
    const newId = chapters.length > 0 ? Math.max(...chapters.map(c => c.number)) + 1 : 1;
    setChapters([
      ...chapters,
      { number: newId, title: `Chapter ${chapters.length + 1}`, content: '' },
    ]);
  };

  const handleRemoveChapter = (id: number) => {
    setChapters(chapters.filter(chapter => chapter.number !== id));
  };

  const handleChapterChange = (id: number, field: keyof Chapter, value: string) => {
    setChapters(
      chapters.map(chapter =>
        chapter.number === id ? { ...chapter, [field]: value } : chapter
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const BASE_URL = 'http://127.0.0.1:3000/api/analyze';
    let endpoint = '';
    let options: RequestInit = {};

    try {
      if (inputType === 'text') {
        endpoint = `${BASE_URL}/text`;
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storyData: chapters.reduce((acc, chapter) => {
              acc[chapter.number] = { title: chapter.title, content: chapter.content };
              return acc;
            }, {} as Record<number, { title: string; content: string }>),
          }),
        };
      } else if (inputType === 'link') {
        endpoint = `${BASE_URL}/link`;
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: link }),
        };
      } else if (inputType === 'file') {
        if (!files || files.length === 0) {
          throw new Error('Please select files to upload.');
        }
        endpoint = `${BASE_URL}/files`;
        const formData = new FormData();
        Array.from(files).forEach(file => {
          formData.append('files', file);
        });
        options = {
          method: 'POST',
          body: formData,
        };
      }

      const response = await fetch(endpoint, options);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      sessionStorage.setItem('analysisResult', JSON.stringify(data));
      router.push('/analysis');

    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsLoading(false);
    }
  };

  const renderInputType = () => {
    switch (inputType) {
      case 'text':
        return (
          <div className="space-y-6">
            {chapters.map((chapter) => (
              <div key={chapter.number} className="p-4 bg-gray-700/50 rounded-lg relative space-y-3">
                {chapters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveChapter(chapter.number)}
                    className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-transform transform hover:scale-110"
                    aria-label="Remove Chapter"
                  >
                    <FaTrash />
                  </button>
                )}
                <label className="block text-sm font-medium text-gray-300">
                  Chapter Title (Optional)
                  <input
                    type="text"
                    value={chapter.title}
                    onChange={(e) => handleChapterChange(chapter.number, 'title', e.target.value)}
                    placeholder={`e.g., ${chapter.title}`}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </label>
                <label className="block text-sm font-medium text-gray-300">
                  Chapter Content
                  <textarea
                    value={chapter.content}
                    onChange={(e) => handleChapterChange(chapter.number, 'content', e.target.value)}
                    rows={10}
                    placeholder="Paste or write your chapter content here..."
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </label>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddChapter}
              className="w-full flex justify-center items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md shadow-lg transition-transform transform hover:scale-105"
            >
              <FaPlus className="mr-2" />
              Add Another Chapter
            </button>
          </div>
        );
      case 'link':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Story URL
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://www.my-story-website.com/story/123"
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </label>
          </div>
        );
      case 'file':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Upload Chapter Files
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="mt-1 block w-full text-sm text-gray-400
                file:mr-4 file:py-3 file:px-5
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              accept=".txt,.md,.docx"
              required
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
          Story Analysis Tool
        </h1>
        
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-gray-700/50">
          <h2 className="text-2xl font-semibold mb-6 text-center">Upload Your Story</h2>
          
          <div className="flex space-x-4 mb-8 justify-center">
            <button
              onClick={() => setInputType('text')}
              className={`flex items-center px-6 py-3 rounded-lg transition-all ${
                inputType === 'text' 
                  ? 'bg-blue-600 text-white shadow-lg scale-105' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <FaFont className="mr-2" />
              Write/Paste Text
            </button>
            <button
              onClick={() => setInputType('link')}
              className={`flex items-center px-6 py-3 rounded-lg transition-all ${
                inputType === 'link'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <FaLink className="mr-2" />
              Import from URL
            </button>
            <button
              onClick={() => setInputType('file')}
              className={`flex items-center px-6 py-3 rounded-lg transition-all ${
                inputType === 'file'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <FaFileUpload className="mr-2" />
              Upload Files
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderInputType()}

            {error && (
              <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
                {error}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner className="h-5 w-5 mr-2" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Story'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
