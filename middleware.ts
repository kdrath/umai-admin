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
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const pathname = request.nextUrl.pathname
  const isLogin = pathname.startsWith('/login')
  const isNotAuthorized = pathname.startsWith('/not-authorized')

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Not logged in → only allow /login
  if (!user) {
    if (!isLogin) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return response
  }

  // Logged in → block /login
  if (isLogin) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Admin check
  if (!isNotAuthorized) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single()

    if (error || !profile?.is_admin) {
      return NextResponse.redirect(
        new URL('/not-authorized', request.url)
      )
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
