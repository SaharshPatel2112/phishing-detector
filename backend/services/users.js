import { supabase } from "../db.js";

const ADMIN_EMAILS = ["1saharshpatel2112@gmail.com"];

export async function getOrCreateUser(clerkUserId, email) {
  const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());

  const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .single();

  if (existing) {
    if (isAdmin && existing.role !== "admin") {
      const { data: updated } = await supabase
        .from("users")
        .update({ role: "admin" })
        .eq("id", existing.id)
        .select()
        .single();
      return updated;
    }
    return existing;
  }

  const { data: created, error } = await supabase
    .from("users")
    .insert({
      clerk_user_id: clerkUserId,
      email,
      role: isAdmin ? "admin" : "user",
    })
    .select()
    .single();

  if (error) throw error;
  return created;
}
