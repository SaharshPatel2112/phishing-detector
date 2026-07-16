export function calculateRisk(gsbResult, vtResult) {
  if (gsbResult.flagged) {
    return { level: "high", reason: "Flagged by Google Safe Browsing" };
  }
  if (vtResult.malicious >= 3) {
    return {
      level: "high",
      reason: `${vtResult.malicious} security vendors flagged this as malicious`,
    };
  }
  if (vtResult.malicious >= 1 || vtResult.suspicious >= 3) {
    return {
      level: "medium",
      reason: "Some security vendors flagged this as suspicious",
    };
  }
  return { level: "low", reason: "No threats detected" };
}
