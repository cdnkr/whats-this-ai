const { getJson } = require("serpapi");
const { promisify } = require("util");

const getJsonPromise = promisify(getJson);

async function getImageIdentification(imageUrl) {
  try {
    const json = await getJsonPromise({
      engine: "google_lens",
      url: imageUrl,
      api_key: process.env.SERP_API_KEY,
    });

    const titlesCombined = json.visual_matches.map((match) => match.title).join(" ");
    return findMostFrequentPhrase(titlesCombined);
  } catch (error) {
    console.error("Error getting search results from image:", error);
    throw error;
  }
};

function findMostFrequentPhrase(paragraph) {
  const words = paragraph.toLowerCase().match(/\b\w+\b/g);
  const phraseFrequencyMap = {};
  const phraseLength = 2;

  for (let i = 0; i <= words.length - phraseLength; i++) {
    const phrase = words.slice(i, i + phraseLength).join(" ");
    phraseFrequencyMap[phrase] = (phraseFrequencyMap[phrase] || 0) + 1;
  }

  return Object.entries(phraseFrequencyMap).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
}

module.exports = getImageIdentification;
