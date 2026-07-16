import axios from "axios";

const VT_API_KEY = process.env.VIRUSTOTAL_API_KEY;

function toUrlId(url) {
  return Buffer.from(url)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export async function checkVirusTotal(url) {
  const urlId = toUrlId(url);
  try {
    const { data } = await axios.get(
      `https://www.virustotal.com/api/v3/urls/${urlId}`,
      { headers: { "x-apikey": VT_API_KEY } },
    );
    const stats = data.data.attributes.last_analysis_stats;
    return {
      found: true,
      malicious: stats.malicious,
      suspicious: stats.suspicious,
      harmless: stats.harmless,
    };
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return { found: false, malicious: 0, suspicious: 0, harmless: 0 };
    }
    throw err;
  }
}
