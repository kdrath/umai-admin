import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const pathname = request.nextUrl.pathname

  const isLogin = pathname.startsWith('/login')
  const isNotAuthorized = pathname.startsWith('/not-authorized')
  const isAuthSetSession = pathname.startsWith('/auth/set-session')

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Not logged in:
  // - allow /login
  // - allow POST /auth/set-session so cookies can be established
  // - redirect everything else to /login
  if (!user) {
    if (isLogin || isAuthSetSession) return response
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Logged in: block /login
  if (isLogin) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Admin check (allow /not-authorized so the redirect can land)
  if (!isNotAuthorized) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single()

    if (error || !profile?.is_admin) {
      return NextResponse.redirect(new URL('/not-authorized', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
