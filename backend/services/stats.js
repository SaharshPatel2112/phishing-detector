import { supabase } from "../db.js";

export async function getDashboardStats(userId) {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: scans } = await supabase
    .from("scan_history")
    .select("risk_level, created_at")
    .eq("user_id", userId)
    .gte("created_at", weekAgo);

  const scansThisWeek = scans?.length || 0;
  const threatsBlocked =
    scans?.filter((s) => s.risk_level === "high").length || 0;
  const pendingReview =
    scans?.filter((s) => s.risk_level === "medium").length || 0;
  const markedSafe = scans?.filter((s) => s.risk_level === "low").length || 0;

  return { scansThisWeek, threatsBlocked, pendingReview, markedSafe };
}

export async function getRecentScans(userId) {
  const { data } = await supabase
    .from("scan_history")
    .select("content, scan_type, risk_level, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  return data || [];
}
