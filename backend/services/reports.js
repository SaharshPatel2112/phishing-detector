import { supabase } from "../db.js";

export async function getReport(userId, { riskLevel, scanType, days }) {
    let query = supabase
        .from("scan_history")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (days) {
        const cutoff = new Date(
            Date.now() - Number(days) * 24 * 60 * 60 * 1000,
        ).toISOString();
        query = query.gte("created_at", cutoff);
    }
    if (riskLevel && riskLevel !== "all") {
        query = query.eq("risk_level", riskLevel);
    }
    if (scanType && scanType !== "all") {
        query = query.eq("scan_type", scanType);
    }

    const { data } = await query;
    const scans = data || [];

    return {
        scans,
        summary: {
            total: scans.length,
            high: scans.filter((s) => s.risk_level === "high").length,
            medium: scans.filter((s) => s.risk_level === "medium").length,
            low: scans.filter((s) => s.risk_level === "low").length,
        },
    };
}