'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaChevronDown, FaChevronRight, FaCopy, FaCheck } from 'react-icons/fa';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { CompleteSequentialChapterAnalysis, CompleteContextualChapterAnalysis } from '@story-generation/types';

type SequentialStoryAnalysis = Record<string, CompleteSequentialChapterAnalysis>;
type ContextualStoryAnalysis = Record<string, CompleteContextualChapterAnalysis>;

type FullAnalysisResultData = {
  /**
   * Contains chapter-by-chapter analysis, where each key
   * is a chapter identifier (e.g., "chapter_1").
   */
  sequential: SequentialStoryAnalysis;
  /**
   * Contains chapter-by-chapter analysis with a running
   * 'masterStoryDocument', where each key is a chapter identifier.
   */
  contextual: ContextualStoryAnalysis;
};

type SequentialState = {
  method: 'sequential';
  data: SequentialStoryAnalysis | null;
};

type ContextualState = {
  method: 'contextual';
  data: ContextualStoryAnalysis | null;
};

type AnalysisState = SequentialState | ContextualState;


export default function AnalysisPage() {
  // --- STATE ---
  // State for the *full* data object from session storage
  const [fullData, setFullData] = useState<FullAnalysisResultData | null>(null);

  // ★ SINGLE source of truth for analysis state
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    method: 'sequential',
    data: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // State for the master prompt (now dynamically built)
  const [masterPrompt, setMasterPrompt] = useState(
    'Loading story context...'
  );
  // State for the user's specific direction
  const [userDirection, setUserDirection] = useState('');

  const [isCopied, setIsCopied] = useState(false);
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});

  // --- EFFECTS ---

  // 1. On Mount: Load and parse data from session storage
  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem('analysisResult');
      if (!storedData) {
        setError('No analysis data found. Please analyze a story first.');
        setIsLoading(false);
        return;
      }

      const parsedData = JSON.parse(storedData);
      if (
        !parsedData.success ||
        !parsedData.data ||
        !parsedData.data.sequential ||
        !parsedData.data.contextual
      ) {
        setError('Analysis data is missing or in an invalid format.');
        setIsLoading(false);
        return;
      }

      // Store the *entire* data object
      setFullData(parsedData.data);

      // ★ Set the *initial* analysis state (defaulting to sequential)
      setAnalysisState({
        method: 'sequential',
        data: parsedData.data.sequential,
      });
    } catch (err) {
      setError('Failed to load analysis data. It might be corrupted.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [router]); // Added router to dep array if you use it inside, otherwise [] is fine.

  // 2. On analysisState Change: Update derived state (prompt, accordions)
  useEffect(() => {
    // Don't run if data isn't loaded yet
    if (!analysisState.data) return;

    // ★ Build the master prompt based on the *current* state
    const newMasterPrompt = buildMasterPrompt(analysisState);
    setMasterPrompt(newMasterPrompt);

    // Initialize/reset the open/closed state for all chapters
    const initialOpenState = Object.keys(analysisState.data).reduce(
      (acc, key) => {
        acc[key] = false;
        return acc;
      },
      {} as Record<string, boolean>
    );
    setOpenChapters(initialOpenState);
  }, [analysisState]); // ★ This effect now correctly reacts to the *entire* state object

  // --- HANDLERS ---

  // ★ New handler to update the analysis state
  const handleMethodChange = (method: 'sequential' | 'contextual') => {
    if (!fullData || analysisState.method === method) {
      return; // Don't do anything if data isn't loaded or method is the same
    }

    // Set the new state object based on the selected method
    if (method === 'sequential') {
      setAnalysisState({
        method: 'sequential',
        data: fullData.sequential,
      });
    } else {
      setAnalysisState({
        method: 'contextual',
        data: fullData.contextual,
      });
    }
  };

  const handleToggleChapter = (chapterKey: string) => {
    setOpenChapters((prev) => ({
      ...prev,
      [chapterKey]: !prev[chapterKey],
    }));
  };

  const handleCopyPrompt = () => {
    // Combine the context and the user's direction for copying
    const fullPrompt = `${masterPrompt}\n\n[USER'S DIRECTION]\n${userDirection}`;

    navigator.clipboard
      .writeText(fullPrompt)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  // --- RENDER CONDITIONS ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-100 text-gray-900 flex flex-col items-center justify-center">
        <LoadingSpinner className="h-10 w-10" />
        <span className="ml-3 text-xl mt-4">Loading Analysis...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-100 text-gray-900 flex items-center justify-center p-6">
        <div className="bg-red-100 border border-red-300 rounded-lg p-8 text-red-800 text-center shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ★ Updated check
  if (!analysisState.data) {
    return (
      <div className="min-h-screen bg-stone-100 text-gray-900 flex items-center justify-center">
        <p>No data to display.</p>
      </div>
    );
  }

  // --- MAIN PAGE RENDER ---
  return (
    <div className="min-h-screen bg-stone-100 text-gray-900 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
          Story Analysis Results
        </h1>

        {/* --- ★ Updated Method Switcher --- */}
        <MethodSwitcher
          activeMethod={analysisState.method}
          onMethodChange={handleMethodChange}
        />

        {/* --- Chapter Details Section (Now Type-Safe) --- */}
        <div className="space-y-4 mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Chapter Details
          </h2>

          {/* ★ Typescript now knows analysisState.data is SequentialStoryAnalysis */}
          {analysisState.method === 'sequential' && (
            <SequentialAnalysisView
              data={analysisState.data}
              openChapters={openChapters}
              onToggle={handleToggleChapter}
            />
          )}

          {/* ★ Typescript now knows analysisState.data is ContextualStoryAnalysis */}
          {analysisState.method === 'contextual' && (
            <ContextualAnalysisView
              data={analysisState.data}
              openChapters={openChapters}
              onToggle={handleToggleChapter}
            />
          )}
        </div>

        {/* --- Master Prompt Section (No changes needed) --- */}
        <div className="sticky bottom-6 z-10">{/* ... */}</div>
      </div>
    </div>
  );
}

// --- HELPER FUNCTIONS & COMPONENTS ---

/**
 * ★ Builds the master prompt string based on the entire state
 */
function buildMasterPrompt(state: AnalysisState): string {
  if (!state.data) return 'Error building prompt.';

  let context = `[SYSTEM]\nYou are a creative story writer. Below is the full context for a story-in-progress. Your task is to continue the story based on the user's direction.\n\n`;

  if (state.method === 'sequential') {
    // ★ state.data is guaranteed to be SequentialStoryAnalysis
    context += `[STORY CONTEXT SO FAR (Sequential)]\n---\n`;
    for (const [key, chapter] of Object.entries(state.data)) {
      context += `[${key.toUpperCase()}]\n`;
      context += `OUTLINE:\n${JSON.stringify(
        chapter.chapterOutline,
        null,
        2
      )}\n\n`;
      context += `CHARACTERS:\n${JSON.stringify(
        chapter.characters,
        null,
        2
      )}\n\n`;
      context += `---\n`;
    }
  } else {
    // ★ state.data is guaranteed to be ContextualStoryAnalysis
    const allKeys = Object.keys(state.data);
    const lastKey = allKeys[allKeys.length - 1];
    const lastChapter = state.data[lastKey];

    if (!lastChapter || !lastChapter.masterStoryDocument) {
      return 'Error: Could not find masterStoryDocument in the latest chapter.';
    }

    context += `[MASTER STORY DOCUMENT]\n`;
    context += JSON.stringify(lastChapter.masterStoryDocument, null, 2);
  }

  return context;
}

/**
 * UI Component for switching analysis methods
 */
function MethodSwitcher({ activeMethod, onMethodChange }: {
  activeMethod: 'sequential' | 'contextual';
  onMethodChange: (method: 'sequential' | 'contextual') => void;
}) {
  const baseStyle = "w-1/2 py-2 px-4 text-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  const activeStyle = "bg-blue-600 text-white shadow";
  const inactiveStyle = "bg-white text-gray-700 hover:bg-gray-100";

  return (
    <div className="w-full max-w-md mx-auto p-1 bg-gray-200 rounded-lg flex space-x-1 mb-8">
      <button
        onClick={() => onMethodChange('sequential')}
        className={`${baseStyle} ${activeMethod === 'sequential' ? activeStyle : inactiveStyle}`}
      >
        Sequential
      </button>
      <button
        onClick={() => onMethodChange('contextual')}
        className={`${baseStyle} ${activeMethod === 'contextual' ? activeStyle : inactiveStyle}`}
      >
        Master Document
      </button>
    </div>
  );
}

/**
 * Renders the view for Sequential analysis
 */
function SequentialAnalysisView({ data, openChapters, onToggle }: {
  data: SequentialStoryAnalysis;
  openChapters: Record<string, boolean>;
  onToggle: (key: string) => void;
}) {
  return (
    <div className="space-y-4">
      {Object.entries(data).map(([key, chapter]) => (
        <div key={key} className="bg-white rounded-xl border border-gray-300 overflow-hidden shadow-md">
          <button
            onClick={() => onToggle(key)}
            className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl font-medium text-gray-800">Chapter {key}</span>
              <span className="text-lg font-semibold text-blue-700">
                (Score: {chapter.score.score})
              </span>
            </div>
            {openChapters[key] ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {openChapters[key] && (
            <div className="p-5 bg-white border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-blue-700">Outline</h3>
                  <pre className="bg-gray-50 p-4 rounded-lg text-sm text-gray-800 overflow-x-auto max-h-96 shadow-inner border border-gray-300">
                    <code>{JSON.stringify(chapter.chapterOutline, null, 2)}</code>
                  </pre>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-purple-700">Characters</h3>
                  <pre className="bg-gray-50 p-4 rounded-lg text-sm text-gray-800 overflow-x-auto max-h-96 shadow-inner border border-gray-300">
                    <code>{JSON.stringify(chapter.characters, null, 2)}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Renders the view for Contextual (Master Document) analysis
 */
function ContextualAnalysisView({ data, openChapters, onToggle }: {
  data: ContextualStoryAnalysis;
  openChapters: Record<string, boolean>;
  onToggle: (key: string) => void;
}) {
  return (
    <div className="space-y-4">
      {Object.entries(data).map(([key, chapter]) => (
        <div key={key} className="bg-white rounded-xl border border-gray-300 overflow-hidden shadow-md">
          <button
            onClick={() => onToggle(key)}
            className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl font-medium text-gray-800">Chapter {key}</span>
              <span className="text-lg font-semibold text-blue-700">
                (Score: {chapter.score.score})
              </span>
            </div>
            {openChapters[key] ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {openChapters[key] && (
            <div className="p-5 bg-white border-t border-gray-200 space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-700">Master Story Document</h3>
                <pre className="bg-gray-50 p-4 rounded-lg text-sm text-gray-800 overflow-x-auto max-h-96 shadow-inner border border-gray-300">
                  <code>{JSON.stringify(chapter.masterStoryDocument, null, 2)}</code>
                </pre>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Score Rationale</h3>
                <p className="bg-gray-50 p-4 rounded-lg text-sm text-gray-800 shadow-inner border border-gray-300">
                  {chapter.score.rationale}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}