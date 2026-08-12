import { supabase } from "../db.js";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export async function getDetectionsOverTime(userId) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const { data: scans } = await supabase
    .from("scan_history")
    .select("risk_level, created_at")
    .eq("user_id", userId)
    .gte("created_at", sevenDaysAgo.toISOString());

  const buckets = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    buckets.push({
      key: d.toDateString(),
      day: DAY_LABELS[d.getDay()],
      scans: 0,
      threats: 0,
    });
  }

  (scans || []).forEach((scan) => {
    const scanDate = new Date(scan.created_at).toDateString();
    const bucket = buckets.find((b) => b.key === scanDate);
    if (bucket) {
      bucket.scans += 1;
      if (scan.risk_level === "high") bucket.threats += 1;
    }
  });

  return buckets.map(({ day, scans, threats }) => ({ day, scans, threats }));
}
