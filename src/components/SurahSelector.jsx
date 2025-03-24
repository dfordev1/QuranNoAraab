import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../context/ThemeContext';

/**
 * Floating hamburger menu for Surah selection
 */
const SurahSelector = ({ surahNames, currentSurah, onSurahSelect, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSurahs, setFilteredSurahs] = useState(surahNames);
  const selectorRef = useRef(null);
  const searchInputRef = useRef(null);
  const { isDarkMode } = useTheme();

  // Apply search filter to surahs
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSurahs(surahNames);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = surahNames.filter(
      surah =>
        surah.number.toString().includes(query) ||
        surah.englishName.toLowerCase().includes(query) ||
        surah.englishNameTranslation.toLowerCase().includes(query)
    );
    setFilteredSurahs(filtered);
  }, [searchQuery, surahNames]);

  // Handle click outside to close the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-focus search input when menu opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setSearchQuery(''); // Clear search when toggling
  };

  const handleSurahSelect = (surahNumber) => {
    onSurahSelect(surahNumber);
    setIsOpen(false);
    setSearchQuery(''); // Clear search after selection
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Group surahs for quick navigation
  const groupedSurahs = [
    { 
      name: "Most Read", 
      surahs: [
        { num: 1, name: "Al-Fatiha" },
        { num: 36, name: "Ya-Sin" },
        { num: 67, name: "Al-Mulk" },
        { num: 18, name: "Al-Kahf" }
      ]
    },
    {
      name: "By Parts",
      surahs: [
        { num: 1, name: "Start" },
        { num: 30, name: "Middle" },
        { num: 114, name: "End" }
      ]
    },
    {
      name: "Short Surahs",
      surahs: [112, 113, 114]
    }
  ];

  return (
    <div className={`relative ${className}`} ref={selectorRef}>
      <button
        onClick={toggleMenu}
        className={`w-full p-4 rounded-lg shadow-md transition-colors duration-200 ${
          isDarkMode 
            ? 'bg-gray-800 hover:bg-gray-700 text-white' 
            : 'bg-white hover:bg-gray-50 text-gray-900'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">Select Surah</span>
          <svg
            className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className={`absolute z-50 w-full mt-2 rounded-lg shadow-lg transition-colors duration-200 ${
          isDarkMode 
            ? 'bg-gray-800 text-white' 
            : 'bg-white text-gray-900'
        }`}>
          <div className="sticky top-0 p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search surah..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <svg
                className={`absolute left-3 top-2.5 h-5 w-5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {searchQuery ? (
              <div className="p-2">
                {filteredSurahs.map((surah) => (
                  <button
                    key={surah.number}
                    onClick={() => {
                      handleSurahSelect(surah.number);
                      setIsOpen(false);
                    }}
                    className={`w-full p-3 text-left rounded-lg transition-colors duration-200 ${
                      isDarkMode 
                        ? 'hover:bg-gray-700' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        isDarkMode 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        {surah.number}
                      </span>
                      <div>
                        <div className="font-medium">{surah.englishName}</div>
                        <div className="text-sm opacity-75">{surah.englishNameTranslation}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-2">
                {groupedSurahs.map((group) => (
                  <div key={group.name} className="mb-4">
                    <h3 className={`px-3 py-2 text-sm font-semibold ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {group.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {group.surahs.map((surah) => (
                        <button
                          key={surah.num}
                          onClick={() => {
                            handleSurahSelect(surah.num);
                            setIsOpen(false);
                          }}
                          className={`p-3 text-left rounded-lg transition-colors duration-200 ${
                            isDarkMode 
                              ? 'hover:bg-gray-700' 
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-sm ${
                              isDarkMode 
                                ? 'bg-gray-700 text-white' 
                                : 'bg-gray-100 text-gray-900'
                            }`}>
                              {surah.num}
                            </span>
                            <span className="font-medium">{surah.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

SurahSelector.propTypes = {
  surahNames: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      englishName: PropTypes.string.isRequired,
      englishNameTranslation: PropTypes.string.isRequired,
    })
  ).isRequired,
  currentSurah: PropTypes.number.isRequired,
  onSurahSelect: PropTypes.func.isRequired,
  className: PropTypes.string,
};

SurahSelector.defaultProps = {
  className: '',
};

export default SurahSelector;
