import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Component for selecting verses at the top of the page
 */
const VerseSelector = ({
  currentSurah,
  currentVerse,
  surahNames,
  verseCount,
  onVerseSelect,
  className
}) => {
  const [showSelector, setShowSelector] = useState(false);
  const [availableVerses, setAvailableVerses] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const selectorRef = useRef(null);

  // Create an array of available verse numbers for the current surah
  useEffect(() => {
    const verses = Array.from({ length: verseCount }, (_, i) => i + 1);
    setAvailableVerses(verses);
  }, [currentSurah, verseCount]);

  // Handle scroll position for sticky header effects
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      setIsSticky(position > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setShowSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleVerseSelect = (verseNumber) => {
    onVerseSelect(verseNumber);
    setShowSelector(false);
  };

  const currentSurahName = surahNames.find(surah => surah.number === currentSurah);

  return (
    <div
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isSticky ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white shadow-sm'
      } ${className}`}
      ref={selectorRef}
    >
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="text-emerald-800 flex flex-col">
          <div className="flex items-center">
            <span className="font-bold">
              {currentSurahName?.englishName}
            </span>
            <span className="text-xs ml-2 text-gray-600">
              ({currentSurahName?.englishNameTranslation})
            </span>
          </div>
          <div className="font-arabic text-xl text-right mt-1 leading-tight">
            {currentSurahName?.name}
          </div>
        </div>

        <div className="relative">
          <button
            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center"
            onClick={() => setShowSelector(!showSelector)}
          >
            <span className="flex items-center">
              <span className="verse-number-small">
                {currentVerse}
              </span>
              <span className="ml-2">Verse</span>
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-2 transition-transform ${showSelector ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showSelector && (
            <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-72 max-h-96 overflow-hidden flex flex-col">
              <div className="sticky top-0 bg-white p-2 border-b border-gray-200 text-center text-sm font-bold">
                Select Verse
              </div>

              {availableVerses.length > 30 && (
                <div className="p-2 border-b border-gray-100">
                  <div className="flex gap-2 flex-wrap">
                    {[1, 5, 10, 20, 30, 40, 50, 75, 100].map(jump => {
                      if (jump <= verseCount) {
                        return (
                          <button
                            key={`jump-${jump}`}
                            className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
                            onClick={() => handleVerseSelect(jump)}
                          >
                            Go to {jump}
                          </button>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}

              <div className="overflow-y-auto flex-1">
                <div className="grid grid-cols-5 gap-2 p-2">
                  {availableVerses.map(verseNumber => (
                    <button
                      key={verseNumber}
                      className={`rounded p-2 text-sm text-center hover:bg-gray-100 transition-colors ${
                        currentVerse === verseNumber ? 'bg-emerald-100 text-emerald-800 font-semibold' : ''
                      }`}
                      onClick={() => handleVerseSelect(verseNumber)}
                    >
                      {verseNumber}
                    </button>
                  ))}
                </div>
              </div>

              {verseCount > 20 && (
                <div className="p-2 border-t border-gray-100 text-xs text-center text-gray-500">
                  {verseCount} verses in total
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

VerseSelector.propTypes = {
  currentSurah: PropTypes.number.isRequired,
  currentVerse: PropTypes.number.isRequired,
  surahNames: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      englishName: PropTypes.string.isRequired,
      englishNameTranslation: PropTypes.string.isRequired,
    })
  ).isRequired,
  verseCount: PropTypes.number.isRequired,
  onVerseSelect: PropTypes.func.isRequired,
  className: PropTypes.string,
};

VerseSelector.defaultProps = {
  className: '',
};

export default VerseSelector;
