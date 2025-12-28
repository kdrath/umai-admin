'use client'

import { useEffect, useState } from 'react'

type WhoAmI = { id: string; email: string } | null

export default function Home() {
  const [user, setUser] = useState<WhoAmI>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/whoami', { cache: 'no-store', credentials: 'same-origin' })
        if (!res.ok) {
          setUser(null)
          setError('Not signed in')
          return
        }
        const data = await res.json()
        setUser(data)
      } catch (e: any) {
        setError(e?.message || 'Failed to load user')
      }
    })()
  }, [])

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">UMAI Admin</h1>
      <p className="mt-2 text-sm text-gray-600">
        {user ? Signed in as  : error ? error : 'Loading user...'}
      </p>

      <div className="mt-6 rounded border p-4">
        <p className="text-sm">Dashboard loaded.</p>
      </div>
    </main>
  )
}
