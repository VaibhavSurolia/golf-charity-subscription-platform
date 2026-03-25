"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function verifyWinner(winnerId: string, status: 'verified' | 'rejected', comment?: string) {
  const supabase = await createAdminClient();

  const { error } = await supabase
    .from("winners")
    .update({ 
      verification_status: status,
      admin_comment: comment || null
    })
    .eq("id", winnerId);

  if (error) throw new Error(error.message);

  // --- NEW: Record Charity Payout on Verification ---
  if (status === 'verified') {
    // 1. Fetch Winner Details
    const { data: winner } = await supabase
      .from("winners")
      .select("prize_won, user_id, draw_id")
      .eq("id", winnerId)
      .single();

    if (winner && winner.prize_won > 0) {
      // 2. Fetch User's Selected Charity
      const { data: user } = await supabase
        .from("users")
        .select("charity_id")
        .eq("id", winner.user_id)
        .single();

      if (user?.charity_id) {
        // 3. Insert 10% Match into charity_payouts
        const charityMatch = Number((Number(winner.prize_won) * 0.10).toFixed(2));
        
        await supabase.from("charity_payouts").insert({
          charity_id: user.charity_id,
          draw_id: winner.draw_id,
          amount: charityMatch
        });
      }
    }
  }
  // --- END NEW LOGIC ---

  revalidatePath("/admin/verifications");
  revalidatePath("/dashboard/results");
  return { success: true };
}
