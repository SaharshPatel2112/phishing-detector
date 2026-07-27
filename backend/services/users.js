import { supabase } from "../db.js";

export async function getOrCreateUser(clerkUserId, email) {
  const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .single();

  if (existing) return existing;

  const { data: created, error } = await supabase
    .from("users")
    .insert({ clerk_user_id: clerkUserId, email })
    .select()
    .single();

  if (error) throw error;
  return created;
}
