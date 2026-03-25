import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getURL } from '@/utils/supabase/url'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? 'dashboard' // Remove leading slash if it exists as getURL adds one

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${getURL()}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${getURL()}auth/login?error=Authentication Failed`)
}
