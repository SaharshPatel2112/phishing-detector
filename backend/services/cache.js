import { supabase } from "../db.js";

const CACHE_HOURS = 24;

export async function getCachedUrlScan(url) {
  const cutoff = new Date(
    Date.now() - CACHE_HOURS * 60 * 60 * 1000,
  ).toISOString();
  const { data } = await supabase
    .from("scan_history")
    .select("result, risk_level")
    .eq("scan_type", "url")
    .eq("content", url)
    .gte("created_at", cutoff)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data || null;
}
