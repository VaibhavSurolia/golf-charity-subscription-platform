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

  revalidatePath("/admin/verifications");
  revalidatePath("/dashboard/results");
  return { success: true };
}
