const SUSPICIOUS_PHRASES = [
  "verify your account",
  "account suspended",
  "act immediately",
  "act now",
  "confirm your password",
  "click here to verify",
  "unusual activity detected",
  "your account will be closed",
  "update your billing",
  "urgent action required",
  "limited time",
  "confirm your identity",
  "suspended due to",
];

export function analyzeEmail(content) {
  const lower = content.toLowerCase();
  const matched = SUSPICIOUS_PHRASES.filter((p) => lower.includes(p));

  let level = "low";
  if (matched.length >= 3) level = "high";
  else if (matched.length >= 1) level = "medium";

  return {
    level,
    matched,
    reason:
      matched.length > 0
        ? `Matched suspicious phrases: ${matched.join(", ")}`
        : "No suspicious phrases detected",
  };
}
