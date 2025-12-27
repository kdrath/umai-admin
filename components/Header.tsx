'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Header({ currentPage }: { currentPage: string }) {
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="border-b-2 border-stone-900 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-baseline justify-between">
          <div>
            <h1 className="text-2xl font-serif font-semibold tracking-tight">UMAI</h1>
            <p className="text-xs text-stone-500 mt-1 uppercase tracking-widest">
              Unconventional Media Archive Interface
            </p>
          </div>
          <nav className="flex gap-6 text-xs uppercase tracking-wider items-baseline">
            <Link 
              href="/" 
              className={`hover:text-stone-600 transition-colors ${
                currentPage === 'dashboard' ? 'font-semibold border-b-2 border-stone-900' : ''
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/candidates" 
              className={`hover:text-stone-600 transition-colors ${
                currentPage === 'candidates' ? 'font-semibold border-b-2 border-stone-900' : ''
              }`}
            >
              Candidates
            </Link>
            <Link 
              href="/works" 
              className={`hover:text-stone-600 transition-colors ${
                currentPage === 'works' ? 'font-semibold border-b-2 border-stone-900' : ''
              }`}
            >
              Works
            </Link>
            <Link 
              href="/sources" 
              className={`hover:text-stone-600 transition-colors ${
                currentPage === 'sources' ? 'font-semibold border-b-2 border-stone-900' : ''
              }`}
            >
              Sources
            </Link>
            <button
              onClick={handleLogout}
              className="hover:text-stone-600 transition-colors text-stone-400"
            >
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
