import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Floating hamburger menu for Surah selection
 */
const SurahSelector = ({ surahNames, currentSurah, onSurahSelect, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSurahs, setFilteredSurahs] = useState(surahNames);
  const selectorRef = useRef(null);
  const searchInputRef = useRef(null);

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
    <div className={`fixed bottom-4 right-4 z-50 ${className}`} ref={selectorRef}>
      {/* Hamburger button */}
      <button
        className="bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        onClick={toggleMenu}
        aria-label="Toggle Surah menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Surah selection menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-emerald-50">
              <h2 className="text-xl font-bold text-emerald-800">Select Surah</h2>
              <button
                onClick={toggleMenu}
                className="p-2 hover:bg-emerald-100 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg"
                  placeholder="Search surah by name or number..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 overflow-y-auto">
              {/* Quick navigation section */}
              {!searchQuery && (
                <div className="p-4 bg-gray-50 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Numbered grid 1-10 */}
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <h3 className="text-sm font-semibold text-emerald-800 mb-3">Surahs 1-10</h3>
                      <div className="grid grid-cols-5 gap-2">
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                          <button
                            key={num}
                            onClick={() => handleSurahSelect(num)}
                            className={`p-2 text-sm rounded-lg transition-colors ${
                              currentSurah === num
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-50 hover:bg-emerald-50 text-gray-700'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Most read surahs */}
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <h3 className="text-sm font-semibold text-emerald-800 mb-3">Most Read</h3>
                      <div className="space-y-2">
                        {[1, 36, 67, 18].map(num => {
                          const surah = surahNames.find(s => s.number === num);
                          return surah && (
                            <button
                              key={num}
                              onClick={() => handleSurahSelect(num)}
                              className={`w-full p-2 text-left rounded-lg transition-colors ${
                                currentSurah === num
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-gray-50 hover:bg-emerald-50 text-gray-700'
                              }`}
                            >
                              <span className="font-medium">{surah.englishName}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Last surahs */}
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <h3 className="text-sm font-semibold text-emerald-800 mb-3">Last Surahs</h3>
                      <div className="space-y-2">
                        {[112, 113, 114].map(num => {
                          const surah = surahNames.find(s => s.number === num);
                          return surah && (
                            <button
                              key={num}
                              onClick={() => handleSurahSelect(num)}
                              className={`w-full p-2 text-left rounded-lg transition-colors ${
                                currentSurah === num
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-gray-50 hover:bg-emerald-50 text-gray-700'
                              }`}
                            >
                              <span className="font-medium">{surah.englishName}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Full surah list */}
              <div className="bg-white">
                <ul className="divide-y divide-gray-100">
                  {filteredSurahs.map((surah) => (
                    <li key={surah.number}>
                      <button
                        className={`w-full p-4 hover:bg-gray-50 transition-colors ${
                          currentSurah === surah.number ? 'bg-emerald-50' : ''
                        }`}
                        onClick={() => handleSurahSelect(surah.number)}
                      >
                        <div className="flex items-center gap-4">
                          <span className="flex-none w-8 h-8 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                            {surah.number}
                          </span>
                          <div className="flex-1 text-left">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">{surah.englishName}</span>
                              <span className="font-arabic text-xl text-gray-800">{surah.name}</span>
                            </div>
                            <span className="text-sm text-gray-500">{surah.englishNameTranslation}</span>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* No results message */}
              {filteredSurahs.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto mb-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <p className="text-lg">No surahs found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
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
