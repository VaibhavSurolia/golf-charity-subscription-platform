"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function selectCharity(charityId: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  console.log(`[Charity] Attempting to set charity ${charityId} for user ${user.id}`);

  // 1. Fetch current status to check if active
  const { data: profile } = await supabase
    .from("users")
    .select("subscription_status, charity_id")
    .eq("id", user.id)
    .single();

  const isSubscribed = profile?.subscription_status === "active";

  // 2. Update the user's selected cause
  const { error } = await supabase
    .from("users")
    .update({ charity_id: charityId })
    .eq("id", user.id);

  if (error) {
    console.error(`[Charity] UPDATE ERROR:`, error.message);
    throw new Error(error.message);
  }

  // 3. If active, record impact for the NEWLY selected charity
  if (isSubscribed && charityId) {
    await supabase.from("charity_payouts").insert({
      charity_id: charityId,
      user_id: user.id,
      amount: 169.90, // One month of 10% impact
      status: 'processed'
    });
    console.log(`[Charity] Recorded ₹169.90 impact record for user ${user.id} to charity ${charityId}`);
  }

  console.log(`[Charity] SUCCESS: Updated charity for ${user.id}`);

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/charity");

  return { success: true };
}
