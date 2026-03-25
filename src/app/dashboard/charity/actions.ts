"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function selectCharity(charityId: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  console.log(`[Charity] Attempting to set charity ${charityId} for user ${user.id}`);

  const { error } = await supabase
    .from("users")
    .update({ charity_id: charityId })
    .eq("id", user.id);

  if (error) {
    console.error(`[Charity] UPDATE ERROR:`, error.message);
    throw new Error(error.message);
  }

  console.log(`[Charity] SUCCESS: Updated charity for ${user.id}`);

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/charity");
  
  return { success: true };
}
