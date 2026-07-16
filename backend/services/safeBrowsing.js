import axios from "axios";

const GSB_API_KEY = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
const GSB_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GSB_API_KEY}`;

export async function checkSafeBrowsing(url) {
  const { data } = await axios.post(GSB_URL, {
    client: { clientId: "phishing-detector", clientVersion: "1.0" },
    threatInfo: {
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url }],
    },
  });
  const matches = data.matches || [];
  return {
    flagged: matches.length > 0,
    threatTypes: matches.map((m) => m.threatType),
  };
}
