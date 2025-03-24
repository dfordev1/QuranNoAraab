import { useState, useEffect } from 'react';
import { fetchQuranVerses, fetchSurahNames } from './utils/quranUtils';
import QuranReader from './components/QuranReader';
import './App.css';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import SurahSelector from './components/SurahSelector';

function AppContent() {
  const [selectedSurah, setSelectedSurah] = useState(null);
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-background-dark text-text-dark' : 'bg-background-light text-text-light'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Quran Web App</h1>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SurahSelector onSelectSurah={setSelectedSurah} />
          <QuranReader selectedSurah={selectedSurah} />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
