import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  console.log('code: ', code);
  console.log('next: ', next);

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    console.log('${origin}${next}', `${origin}${next}`)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }


  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
