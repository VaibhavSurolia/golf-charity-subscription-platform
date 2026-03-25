"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addScore(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const score = parseInt(formData.get("score") as string);
  const dateInput = formData.get("date") as string;
  
  if (isNaN(score) || score < 1 || score > 45) {
    return { error: "Score must be between 1 and 45" };
  }

  const roundDate = dateInput ? new Date(dateInput).toISOString() : new Date().toISOString();

  // 1. Get current scores for the user
  const { data: scores, error: fetchError } = await supabase
    .from("scores")
    .select("id")
    .eq("user_id", user.id)
    .order("date", { ascending: true }); // Oldest date first

  if (fetchError) return { error: fetchError.message };

  // 2. If user already has 5 scores, delete the oldest one (by date)
  if (scores.length >= 5) {
    const oldestId = scores[0].id;
    await supabase.from("scores").delete().eq("id", oldestId);
  }

  // 3. Insert the new score
  const { error: insertError } = await supabase.from("scores").insert({
    user_id: user.id,
    score: score,
    date: roundDate,
  });

  if (insertError) return { error: insertError.message };

  revalidatePath("/dashboard/scores");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteScore(scoreId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("scores").delete().eq("id", scoreId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/scores");
  revalidatePath("/dashboard");
  return { success: true };
}
