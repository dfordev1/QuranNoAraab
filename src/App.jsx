import { useState, useEffect } from 'react';
import { fetchQuranVerses, fetchSurahNames } from './utils/quranUtils';
import QuranReader from './components/QuranReader';
import './App.css';

function App() {
  const [quranVerses, setQuranVerses] = useState([]);
  const [surahNames, setSurahNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('Starting to fetch data...');

        // Fetch both Quran verses and Surah names in parallel
        const [verses, names] = await Promise.all([
          fetchQuranVerses(),
          fetchSurahNames()
        ]);

        console.log('Received verses:', verses.length);
        console.log('Received surah names:', names.length);

        if (verses.length > 0 && names.length > 0) {
          setQuranVerses(verses);
          setSurahNames(names);
          setError(null);
        } else {
          console.error('No data received:', { verses: verses.length, names: names.length });
          setError('Failed to load Quran data. Please try again later.');
        }
      } catch (err) {
        console.error('Error loading Quran data:', err);
        setError('Failed to load Quran data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="quran-app">
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mb-4"></div>
            <h2 className="text-xl font-semibold text-emerald-800">Loading Quran Data...</h2>
          </div>
        </div>
      ) : error ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
            <p className="text-gray-700">{error}</p>
            <button
              className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <QuranReader verses={quranVerses} surahNames={surahNames} />
      )}
    </div>
  );
}

export default App;
