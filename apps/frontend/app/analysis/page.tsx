"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { AccordionItem } from '../../components/AccordionItem';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { FaArrowLeft } from 'react-icons/fa';

interface Character {
  name: string;
  description: string;
}

interface ChapterAnalysis {
  title: string;
  summary: string;
  characters: Character[];
  branching_points: string[]
}

interface AnalysisResult {
  chapters: ChapterAnalysis[];
  master_prompt: string;
}

export default function AnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // On page load, try to get the results from session storage
  useEffect(() => {
    try {
      const resultString = sessionStorage.getItem('analysisResult');
      if (resultString) {
        setAnalysisResult(JSON.parse(resultString));
      } else {
        setError('No analysis data found. Redirecting to home page.');
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    } catch (e) {
      setError('Failed to parse analysis data.');
      setTimeout(() => {
        router.push('/');
      }, 3000);
    }
  }, [router]);

  // Handle "Go Back" button click
  const handleGoBack = () => {
    // Clear the session storage so we don't see old results
    sessionStorage.removeItem('analysisResult');
    router.push('/');
  };

  // --- Render States ---

  // 1. Render Error State (replaces alert)
  if (error) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-6 bg-red-900/50 border border-red-700 rounded-lg text-center shadow-xl">
        <h2 className="text-2xl font-bold text-red-300 mb-4">Error</h2>
        <p className="text-red-300 mb-6">{error}</p>
        <button
          onClick={handleGoBack}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
        >
          Go Back
        </button>
      </div>
    );
  }

  // 2. Render Loading State
  if (!analysisResult) {
    return <LoadingSpinner />;
  }

  // 3. Render Success State
  // Once loaded, extract data
  const { chapters: chapterAnalysis = [], master_prompt = '' } = analysisResult || {};

  // Aggregate all branching points into one list for its own section
  const allBranchingPoints = chapterAnalysis.reduce<Array<{point: string; chapterTitle: string}>>((acc, chapter) => {
    if (chapter.branching_points && Array.isArray(chapter.branching_points)) {
      return acc.concat(chapter.branching_points.map(point => ({
        point: point,
        chapterTitle: chapter.title || 'Unnamed Chapter'
      })));
    }
    return acc;
  }, []);

  return (
    <div className="max-w-5xl mx-auto my-12">
      <button
        onClick={handleGoBack}
        className="flex items-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg mb-8 shadow-lg transition-transform transform hover:scale-105"
      >
        <FaArrowLeft className="mr-2" />
        Analyze Another Story
      </button>

      <h1 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        Story Analysis Results
      </h1>

      {/* --- Section 1: Summaries --- */}
      <h2 className="text-3xl font-bold mb-4 text-white border-b-2 border-gray-700 pb-2">Chapter Summaries</h2>
      {chapterAnalysis.map((chapter, index) => (
        <AccordionItem key={index} title={chapter.title || `Chapter ${index + 1}`}>
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{chapter.summary}</p>
        </AccordionItem>
      ))}

      {/* --- Section 2: Characters --- */}
      <h2 className="text-3xl font-bold mt-12 mb-4 text-white border-b-2 border-gray-700 pb-2">Character Appearances</h2>
      {chapterAnalysis.map((chapter, index) => (
        <AccordionItem key={index} title={chapter.title || `Chapter ${index + 1}`}>
          {chapter.characters && chapter.characters.length > 0 ? (
            <ul className="list-disc list-inside space-y-3">
              {chapter.characters?.map((char: Character, charIndex: number) => (
                <li key={charIndex} className="text-gray-300">
                  <strong className="text-white">{char.name}:</strong> {char.description}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">No specific characters noted in this chapter.</p>
          )}
        </AccordionItem>
      ))}

      {/* --- Section 3: Branching Points --- */}
      <h2 className="text-3xl font-bold mt-12 mb-4 text-white border-b-2 border-gray-700 pb-2">Potential Branching Points</h2>
      <div className="space-y-4">
        {allBranchingPoints.length > 0 ? (
          allBranchingPoints.map((point: {point: string; chapterTitle: string}, index: number) => (
            <div key={index} className="bg-gray-800 p-5 rounded-lg shadow-md">
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                <strong className="text-blue-400 block mb-1">(From: {point.chapterTitle})</strong>
                {point.point}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic">No specific branching points were identified.</p>
        )}
      </div>

      {/* --- Section 4: Master Prompt --- */}
      <h2 className="text-3xl font-bold mt-12 mb-4 text-white border-b-2 border-gray-700 pb-2">Generation Details</h2>
      <AccordionItem title="View Master Prompt Used">
        <pre className="text-gray-300 bg-gray-900 p-4 rounded-md whitespace-pre-wrap text-sm font-mono leading-relaxed">
          {master_prompt || "No master prompt was recorded."}
        </pre>
      </AccordionItem>
    </div>
  );
}