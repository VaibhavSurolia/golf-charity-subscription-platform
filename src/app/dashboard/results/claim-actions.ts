"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function submitClaim(winnerId: string, proofUrl: string) {
  // 1. Verify the user is authenticated using their session
  const userClient = await createClient();
  const { data: { user } } = await userClient.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // 2. Verify this winner record actually belongs to this user
  const { data: record } = await userClient
    .from("winners")
    .select("id, user_id")
    .eq("id", winnerId)
    .eq("user_id", user.id)
    .single();

  if (!record) throw new Error("Winner record not found or does not belong to you.");

  // 3. Use the ADMIN client to perform the update — this bypasses RLS
  //    which may not have an UPDATE policy configured for the winners table.
  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("winners")
    .update({ 
      proof_url: proofUrl,
      verification_status: "pending",
      claimed_at: new Date().toISOString(),
    })
    .eq("id", winnerId);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/results");
  revalidatePath("/admin/verifications");
  revalidatePath("/admin");
  return { success: true };
}
