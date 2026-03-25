"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function registerCharity(formData: FormData) {
  const supabase = createAdminClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const website = formData.get("website") as string;
  const logo_url = formData.get("logo_url") as string;

  if (!name) return { error: "Charity name is required." };

  const { error } = await supabase.from("charities").insert({
    name,
    description,
    website,
    logo_url,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/charities");
  revalidatePath("/dashboard/charity");
  return { success: true };
}

export async function deleteCharity(id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("charities").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/charities");
  revalidatePath("/dashboard/charity");
  return { success: true };
}
