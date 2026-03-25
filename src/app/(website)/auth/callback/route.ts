import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Use the actual request origin to stay on the same domain
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // Fallback to error page on the same domain
  return NextResponse.redirect(new URL('/auth/login?error=Authentication Failed', request.url))
}
