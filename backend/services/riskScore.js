import { checkUrlHeuristics } from "./urlHeuristics.js";

export function calculateRisk(gsbResult, vtResult, url) {
  const heuristicFlags = checkUrlHeuristics(url);
  let level, reason;

  if (gsbResult.flagged) {
    level = "high";
    reason = "Flagged by Google Safe Browsing";
  } else if (vtResult.malicious >= 3) {
    level = "high";
    reason = `${vtResult.malicious} security vendors flagged this as malicious`;
  } else if (vtResult.malicious >= 1 || vtResult.suspicious >= 3) {
    level = "medium";
    reason = "Some security vendors flagged this as suspicious";
  } else if (heuristicFlags.length >= 2) {
    level = "medium";
    reason = `Suspicious characteristics: ${heuristicFlags.join(", ")}`;
  } else if (heuristicFlags.length === 1) {
    level = "low";
    reason = `Minor flag: ${heuristicFlags[0]}`;
  } else {
    level = "low";
    reason = "No threats detected";
  }

  return {
    level,
    reason,
    sources: {
      googleSafeBrowsing: gsbResult.flagged ? "flagged" : "clean",
      virusTotal: vtResult.found
        ? `${vtResult.malicious} malicious, ${vtResult.suspicious} suspicious, ${vtResult.harmless} harmless`
        : "not previously scanned",
      heuristics:
        heuristicFlags.length > 0 ? heuristicFlags.join(", ") : "none",
    },
  };
}
