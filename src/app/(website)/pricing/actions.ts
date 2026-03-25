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

  // 1. Fetch user profile to get charity_id
  const { data: profile } = await supabase
    .from("users")
    .select("charity_id")
    .eq("id", user.id)
    .single();

  // 2. Update the user's subscription status in the database
  const { error } = await supabase
    .from("users")
    .update({ subscription_status: "active" })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating subscription:", error);
    return { error: `Database Error: ${error.message} (Code: ${error.code})` };
  }

  // 3. Log the 10% charity payout (10% of ₹1699 = ₹169.90)
  if (profile?.charity_id) {
    await supabase.from("charity_payouts").insert({
      charity_id: profile.charity_id,
      user_id: user.id,
      amount: 169.90
    });
  }

  // Revalidate layout
  revalidatePath("/dashboard", "layout");
  return { success: true };
}
