import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          if (typeof document === 'undefined') return undefined
          const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
          return match ? decodeURIComponent(match[2]) : undefined
        },
        set(name: string, value: string, options: any) {
          if (typeof document === 'undefined') return
          let cookie = `${name}=${encodeURIComponent(value)}`
          if (options?.maxAge) cookie += `; Max-Age=${options.maxAge}`
          if (options?.expires) cookie += `; Expires=${options.expires.toUTCString?.() ?? options.expires}`
          cookie += `; Path=${options?.path ?? '/'}`
          if (options?.sameSite) cookie += `; SameSite=${options.sameSite}`
          if (options?.secure) cookie += '; Secure'
          document.cookie = cookie
        },
        remove(name: string, options: any) {
          if (typeof document === 'undefined') return
          document.cookie = `${name}=; Path=${options?.path ?? '/'}; Max-Age=0`
        },
      },
    }
  )
}
