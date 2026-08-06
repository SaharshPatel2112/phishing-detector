import { supabase } from "../db.js";

function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

export async function analyzeEmail(content) {
  const { data: keywords } = await supabase
    .from("suspicious_keywords")
    .select("phrase, weight");
  const normalizedContent = normalize(content);
  const matched = (keywords || []).filter((k) =>
    normalizedContent.includes(normalize(k.phrase)),
  );
  const score = matched.reduce((sum, k) => sum + k.weight, 0);

  let level = "low";
  if (score >= 3) level = "high";
  else if (score >= 1) level = "medium";

  return {
    level,
    matched: matched.map((k) => k.phrase),
    reason:
      matched.length > 0
        ? `Matched suspicious phrases: ${matched.map((k) => k.phrase).join(", ")}`
        : "No suspicious phrases detected",
  };
}
