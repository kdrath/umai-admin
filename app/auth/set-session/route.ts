import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(req: Request) {
  const { access_token, refresh_token } = await req.json()

  if (!access_token || !refresh_token) {
    return new NextResponse('Missing tokens', { status: 400 })
  }

  const supabase = createClient()

  const { error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  })

  if (error) {
    return new NextResponse(error.message, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
