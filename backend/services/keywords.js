import { supabase } from "../db.js";

export async function getKeywords() {
  const { data } = await supabase
    .from("suspicious_keywords")
    .select("*")
    .order("created_at", { ascending: false });
  return data || [];
}

export async function addKeyword(phrase, weight = 1) {
  const { data, error } = await supabase
    .from("suspicious_keywords")
    .insert({ phrase, weight })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteKeyword(id) {
  const { error } = await supabase
    .from("suspicious_keywords")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
