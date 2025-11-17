'use client';

import { AnalysisMethod } from '@story-generation/types';

type MethodSwitcherProps = {
  activeMethod: AnalysisMethod;
  onMethodChange: (method: AnalysisMethod) => void;
};

/**
 * UI Component for switching analysis methods
 */
export function MethodSwitcher({
  activeMethod,
  onMethodChange,
}: MethodSwitcherProps) {
  const baseStyle =
    'w-1/2 py-2 px-4 text-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  const activeStyle = 'bg-blue-600 text-white shadow';
  const inactiveStyle = 'bg-white text-gray-700 hover:bg-gray-100';

  return (
    <div className="w-full max-w-md mx-auto p-1 bg-gray-200 rounded-lg flex space-x-1 mb-8">
      <button
        onClick={() => onMethodChange('individual')}
        className={`${baseStyle} ${
          activeMethod === 'individual' ? activeStyle : inactiveStyle
        }`}
      >
        Individual
      </button>
      <button
        onClick={() => onMethodChange('contextual')}
        className={`${baseStyle} ${
          activeMethod === 'contextual' ? activeStyle : inactiveStyle
        }`}
      >
        Master Document
      </button>
    </div>
  );
}