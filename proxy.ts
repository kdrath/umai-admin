import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Protect everything except login + auth endpoints + static assets
export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname

  // allow public routes
  if (path.startsWith('/login') || path.startsWith('/auth')) {
    return NextResponse.next()
  }

  // "Optimistic" auth check: look for the Supabase auth cookie
  // Typical cookie name pattern:
  // sb-<project-ref>-auth-token
  const hasSbAuthCookie = req.cookies
    .getAll()
    .some((c) => c.name.includes('sb-') && c.name.endsWith('-auth-token') && !!c.value)

  if (!hasSbAuthCookie) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
