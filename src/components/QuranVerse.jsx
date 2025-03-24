import PropTypes from 'prop-types';

/**
 * Component for displaying a single Quran verse in a traditional Mushaf style
 */
const QuranVerse = ({ verse, isActive, onVerseClick }) => {
  if (!verse) return null;

  // Add verse number decorations in Arabic
  const getArabicNumber = (num) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map(digit => arabicNumbers[parseInt(digit)]).join('');
  };

  return (
    <div
      className={`p-4 mb-2 rounded-lg transition-colors cursor-pointer ${
        isActive ? 'bg-emerald-50 border-r-4 border-emerald-500' : 'hover:bg-gray-50'
      }`}
      onClick={() => onVerseClick(verse.SurahNum, verse.AyahNum)}
      data-surah={verse.SurahNum}
      data-ayah={verse.AyahNum}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="verse-number">
            {verse.AyahNum}
          </div>
        </div>
      </div>

      <div
        className="text-right font-arabic text-2xl leading-loose tracking-wide mb-2"
        lang="ar"
        dir="rtl"
      >
        {verse.Ayah}
        <span className="inline-block mr-1 text-emerald-700 opacity-70">
          {` ﴿${getArabicNumber(verse.AyahNum)}﴾ `}
        </span>
      </div>
    </div>
  );
};

QuranVerse.propTypes = {
  verse: PropTypes.shape({
    '': PropTypes.number,
    SurahNum: PropTypes.number.isRequired,
    AyahNum: PropTypes.number.isRequired,
    Ayah: PropTypes.string.isRequired,
  }),
  isActive: PropTypes.bool,
  onVerseClick: PropTypes.func.isRequired,
};

QuranVerse.defaultProps = {
  isActive: false,
};

export default QuranVerse;
