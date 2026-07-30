import { supabase } from "../db.js";
import { getAuth } from "@clerk/express";

export async function requireAdmin(req, res, next) {
  const { userId } = getAuth(req);
  const { data: user } = await supabase
    .from("users")
    .select("role")
    .eq("clerk_user_id", userId)
    .single();

  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}
