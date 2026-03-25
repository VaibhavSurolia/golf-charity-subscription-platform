'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function getRedirectUrl(userId: string) {
  const adminClient = createAdminClient();
  
  const { data: profile, error } = await adminClient
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) {
    console.error(`[Auth] Detailed Role Fetch Error for ${userId}:`, error.message);
    return "/dashboard";
  }

  const role = profile?.role?.toLowerCase();
  console.log(`[Auth] SUCCESS: User ${userId} has role: ${role}. Redirecting...`);
  
  return role === "admin" ? "/admin" : "/dashboard";
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const authData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: result, error } = await supabase.auth.signInWithPassword(authData)

  if (error || !result.user) {
    redirect('/auth/login?error=Could not authenticate user')
  }

  revalidatePath('/')
  const redirectUrl = await getRedirectUrl(result.user.id);
  redirect(redirectUrl);
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
        data: {
          full_name: formData.get('name') as string,
        }
    }
  }

  const { data: result, error } = await supabase.auth.signUp(data)

  if (error || !result.user) {
    redirect(`/auth/signup?error=${error?.message || "Signup failed"}`)
  }

  revalidatePath('/')
  const redirectUrl = await getRedirectUrl(result.user.id);
  redirect(redirectUrl);
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/auth/login');
}
