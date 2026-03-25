"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function activateSubscription() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "AUTH_REQUIRED" };
  }

  // Update the user's subscription status in the database
  const { error } = await supabase
    .from("users")
    .update({ subscription_status: "active" })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating subscription:", error);
    return { error: `Database Error: ${error.message} (Code: ${error.code})` };
  }

  // Revalidate layout
  revalidatePath("/dashboard", "layout");
  return { success: true };
}
