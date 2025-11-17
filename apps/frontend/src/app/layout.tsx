/* app/layout.tsx */
import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css'; // Import the global styles
import Providers from '@/lib/providers';

// Setup the font
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Story Analyzer',
  description: 'Analyze your stories with AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      </head>
      {/* - Add the font class name
        - Add a subtle gradient for depth (from gray-900 to 950)
        - Set min-h-screen and text-white globally
      */}
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white`}>
        {/* - This main tag now controls the max-width and padding for all pages
          - We'll use the 'max-w-4xl' you had on your page
        */}
        <main className="max-w-4xl mx-auto px-4 py-12">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}