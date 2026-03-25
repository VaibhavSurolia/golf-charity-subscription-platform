"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function promoteToAdmin(userId: string) {
  const supabase = await createClient();

  // 1. Verify Requesting User is Admin
  const { data: { user: requester } } = await supabase.auth.getUser();
  if (!requester) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", requester.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Only admins can promote users.");
  }

  // 2. Update Role
  const { error } = await supabase
    .from("users")
    .update({ role: "admin" })
    .eq("id", userId);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { success: true };
}
