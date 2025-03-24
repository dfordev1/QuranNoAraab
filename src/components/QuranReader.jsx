import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import QuranVerse from './QuranVerse';
import VerseSelector from './VerseSelector';
import SurahSelector from './SurahSelector';
import { getVersesBySurah } from '../utils/quranUtils';

/**
 * Main Quran reader component with infinite scroll
 */
const QuranReader = ({ verses, surahNames }) => {
  const [currentSurah, setCurrentSurah] = useState(1);
  const [currentVerse, setCurrentVerse] = useState(1);
  const [visibleVerses, setVisibleVerses] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();
  const VERSES_PER_PAGE = 20; // Increased from 10 to 20 for better performance

  console.log('QuranReader received:', { verses: verses.length, surahNames: surahNames.length });

  // Get current Surah's verses - use memoization for better performance
  const surahVerses = useMemo(() => {
    const versesForSurah = getVersesBySurah(verses, currentSurah);
    console.log(`Verses for Surah ${currentSurah}:`, versesForSurah.length);
    return versesForSurah;
  }, [verses, currentSurah]);

  // Reset state when changing Surah
  useEffect(() => {
    setCurrentVerse(1);
    setVisibleVerses([]);
    setPage(1);
    setHasMore(true);
    window.scrollTo(0, 0);
  }, [currentSurah]);

  // Load more verses when page changes
  useEffect(() => {
    if (surahVerses.length > 0) {
      const startIndex = 0;
      const endIndex = page * VERSES_PER_PAGE;
      const newVisibleVerses = surahVerses.slice(startIndex, endIndex);

      setVisibleVerses(newVisibleVerses);
      setHasMore(endIndex < surahVerses.length);
    }
  }, [page, surahVerses]);

  // Intersection observer for infinite scroll - with debounce to improve performance
  const lastVerseElementRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        // Small timeout to debounce multiple calls
        setTimeout(() => {
          setPage(prevPage => prevPage + 1);
        }, 100);
      }
    });

    if (node) observer.current.observe(node);
  }, [hasMore]);

  // Handle Surah selection
  const handleSurahSelect = (surahNum) => {
    setCurrentSurah(surahNum);
  };

  // Handle Verse selection
  const handleVerseSelect = (verseNum) => {
    setCurrentVerse(verseNum);

    // Find the matching verse element and scroll to it
    const verseElement = document.getElementById(`verse-${currentSurah}-${verseNum}`);
    if (verseElement) {
      verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // If verse isn't loaded yet, load enough pages to include it
      const requiredPage = Math.ceil(verseNum / VERSES_PER_PAGE);
      setPage(Math.max(requiredPage, page));

      // After setting the page, wait for render and then try to scroll again
      setTimeout(() => {
        const newVerseElement = document.getElementById(`verse-${currentSurah}-${verseNum}`);
        if (newVerseElement) {
          newVerseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  };

  // Handle click on a verse
  const handleVerseClick = (surahNum, verseNum) => {
    setCurrentVerse(verseNum);
  };

  // Get current Surah name
  const currentSurahInfo = useMemo(() => {
    return surahNames.find(surah => surah.number === currentSurah);
  }, [surahNames, currentSurah]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Verse Selector at the top */}
      <VerseSelector
        currentSurah={currentSurah}
        currentVerse={currentVerse}
        surahNames={surahNames}
        verseCount={surahVerses.length}
        onVerseSelect={handleVerseSelect}
      />

      {/* Main content area */}
      <div className="container mx-auto px-4 py-8">
        {/* Surah header */}
        <div className="text-center mb-6">
          <h1 className="font-arabic text-3xl font-bold text-emerald-800">
            {currentSurahInfo?.name}
          </h1>
          <h2 className="text-xl text-emerald-600 mt-1">
            {currentSurahInfo?.englishName}: {currentSurahInfo?.englishNameTranslation}
          </h2>
        </div>

        {/* Bismillah for each Surah except Surah 9 */}
        {currentSurah !== 9 && currentSurah !== 1 && (
          <div className="bismillah">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        )}

        {/* Verse display with virtualization for better performance */}
        <div className="space-y-4">
          {visibleVerses.map((verse, index) => {
            if (index + 1 === visibleVerses.length) {
              return (
                <div
                  id={`verse-${verse.SurahNum}-${verse.AyahNum}`}
                  key={`${verse.SurahNum}-${verse.AyahNum}`}
                  ref={lastVerseElementRef}
                >
                  <QuranVerse
                    verse={verse}
                    isActive={currentVerse === verse.AyahNum}
                    onVerseClick={handleVerseClick}
                  />
                </div>
              );
            } else {
              return (
                <div
                  id={`verse-${verse.SurahNum}-${verse.AyahNum}`}
                  key={`${verse.SurahNum}-${verse.AyahNum}`}
                >
                  <QuranVerse
                    verse={verse}
                    isActive={currentVerse === verse.AyahNum}
                    onVerseClick={handleVerseClick}
                  />
                </div>
              );
            }
          })}

          {/* Loading indicator */}
          {hasMore && (
            <div className="text-center p-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
            </div>
          )}
        </div>

        {/* End of Surah indicator */}
        {!hasMore && visibleVerses.length > 0 && (
          <div className="text-center py-8 text-emerald-700 font-semibold">
            ― End of Surah {currentSurahInfo?.englishName} ―
          </div>
        )}
      </div>

      {/* Floating Surah Selector */}
      <SurahSelector
        surahNames={surahNames}
        currentSurah={currentSurah}
        onSurahSelect={handleSurahSelect}
      />
    </div>
  );
};

QuranReader.propTypes = {
  verses: PropTypes.arrayOf(
    PropTypes.shape({
      '': PropTypes.number,
      SurahNum: PropTypes.number.isRequired,
      AyahNum: PropTypes.number.isRequired,
      Ayah: PropTypes.string.isRequired,
    })
  ).isRequired,
  surahNames: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      englishName: PropTypes.string.isRequired,
      englishNameTranslation: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default QuranReader;
