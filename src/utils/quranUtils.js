/**
 * Utility functions for working with Quran data
 */

/**
 * Fetches the Quran verses from the external JSON file
 * @returns {Promise<Array>} Array of Quran verses
 */
export const fetchQuranVerses = async () => {
  try {
    const response = await fetch('https://cdn.jsdelivr.net/gh/dfordev1/QuranNoAraab@main/csvjson.json');
    if (!response.ok) {
      throw new Error('Failed to fetch Quran data');
    }
    const data = await response.json();
    console.log('Fetched Quran data:', data.length, 'verses'); // Add logging
    return data;
  } catch (error) {
    console.error('Error fetching Quran data:', error);
    return [];
  }
};

/**
 * Fetches the Surah names from the local JSON file
 * @returns {Promise<Array>} Array of Surah names
 */
export const fetchSurahNames = async () => {
  try {
    const response = await fetch('/surah-names.json');
    if (!response.ok) {
      throw new Error('Failed to fetch Surah names');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Surah names:', error);
    return [];
  }
};

/**
 * Gets all verses for a specific Surah
 * @param {Array} verses - Array of all Quran verses
 * @param {number} surahNum - Surah number to filter by
 * @returns {Array} Array of verses for the specified Surah
 */
export const getVersesBySurah = (verses, surahNum) => {
  return verses.filter(verse => verse.SurahNum === surahNum);
};

/**
 * Gets a specific verse by Surah number and Ayah number
 * @param {Array} verses - Array of all Quran verses
 * @param {number} surahNum - Surah number
 * @param {number} ayahNum - Ayah number
 * @returns {Object|null} Verse object or null if not found
 */
export const getSpecificVerse = (verses, surahNum, ayahNum) => {
  return verses.find(verse => verse.SurahNum === surahNum && verse.AyahNum === ayahNum) || null;
};

/**
 * Gets all unique Surah numbers from the verses
 * @param {Array} verses - Array of all Quran verses
 * @returns {Array} Array of unique Surah numbers
 */
export const getUniqueSurahs = (verses) => {
  const surahSet = new Set(verses.map(verse => verse.SurahNum));
  return [...surahSet].sort((a, b) => a - b);
};

/**
 * Gets a Surah name by its number
 * @param {Array} surahNames - Array of Surah names
 * @param {number} surahNum - Surah number to find
 * @returns {Object|null} Surah name object or null if not found
 */
export const getSurahNameByNumber = (surahNames, surahNum) => {
  return surahNames.find(surah => surah.number === surahNum) || null;
};
