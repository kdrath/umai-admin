const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')
  setLoading(true)

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.session) {
      throw error || new Error('No session returned')
    }

    // Send tokens to server to set cookies
    const res = await fetch('/auth/set-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      }),
    })

    if (!res.ok) {
      throw new Error('Failed to establish session')
    }

    // Full reload so middleware runs with cookies
    window.location.href = '/'
  } catch (error: any) {
    setError(error.message || 'Login failed')
  } finally {
    setLoading(false)
  }
}
