import { supabase } from "../db.js";

export async function getAllUsers() {
  const { data: users } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });
  const { data: scans } = await supabase
    .from("scan_history")
    .select("user_id, risk_level");

  return (users || []).map((u) => {
    const userScans = (scans || []).filter((s) => s.user_id === u.id);
    return {
      ...u,
      scanCount: userScans.length,
      highRiskCount: userScans.filter((s) => s.risk_level === "high").length,
    };
  });
}

export async function getAllScans({ riskLevel, scanType, days, search } = {}) {
  let query = supabase
    .from("scan_history")
    .select("*, users(email)")
    .order("created_at", { ascending: false })
    .limit(200);

  if (days) {
    const cutoff = new Date(
      Date.now() - Number(days) * 24 * 60 * 60 * 1000,
    ).toISOString();
    query = query.gte("created_at", cutoff);
  }
  if (riskLevel && riskLevel !== "all")
    query = query.eq("risk_level", riskLevel);
  if (scanType && scanType !== "all") query = query.eq("scan_type", scanType);
  if (search) query = query.ilike("content", `%${search}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getAdminAnalytics() {
  const { data: users } = await supabase.from("users").select("id");
  const { data: allScans } = await supabase
    .from("scan_history")
    .select("risk_level, scan_type, created_at");
  const scans = allScans || [];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  return {
    totalUsers: users?.length || 0,
    totalScans: scans.length,
    scansThisWeek: scans.filter((s) => s.created_at >= weekAgo).length,
    highRisk: scans.filter((s) => s.risk_level === "high").length,
    mediumRisk: scans.filter((s) => s.risk_level === "medium").length,
    lowRisk: scans.filter((s) => s.risk_level === "low").length,
    byType: {
      url: scans.filter((s) => s.scan_type === "url").length,
      email: scans.filter((s) => s.scan_type === "email").length,
      pdf: scans.filter((s) => s.scan_type === "pdf").length,
    },
  };
}
