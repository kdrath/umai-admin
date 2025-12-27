'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export interface DiscoveryCandidate {
  id: string
  title: string
  source: string
  source_url: string
  discovered_at: string
  status: 'pending' | 'approved' | 'rejected'
  curator_notes?: string
}
import Link from 'next/link'
import Header from '@/components/Header'

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<DiscoveryCandidate[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('new')

  useEffect(() => {
    const supabase = createClient()
    loadCandidates()
  }, [statusFilter])

  async function loadCandidates() {
    setLoading(true)
    
    let query = supabase
      .from('discovery_candidates')
      .select('*')
      .order('signal_score', { ascending: false })
    
    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }
    
    const { data } = await query
    setCandidates(data || [])
    setLoading(false)
  }

  return (
    <div className="min-h-screen archival-grid">
      <Header currentPage="candidates" />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-serif font-semibold mb-2">Discovery Candidates</h2>
            <p className="text-sm text-stone-600">Review and triage works found by collectors</p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setStatusFilter('all')}
              className={`btn ${statusFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All
            </button>
            <button 
              onClick={() => setStatusFilter('new')}
              className={`btn ${statusFilter === 'new' ? 'btn-primary' : 'btn-secondary'}`}
            >
              New
            </button>
            <button 
              onClick={() => setStatusFilter('watching')}
              className={`btn ${statusFilter === 'watching' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Watching
            </button>
            <button 
              onClick={() => setStatusFilter('promoted')}
              className={`btn ${statusFilter === 'promoted' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Promoted
            </button>
            <button 
              onClick={() => setStatusFilter('rejected')}
              className={`btn ${statusFilter === 'rejected' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Rejected
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-stone-500">Loading candidates...</div>
        ) : candidates.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-stone-500 mb-4">No candidates in this status</div>
            <p className="text-xs text-stone-400">Collectors will populate the queue once deployed</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="table">
              <thead>
                <tr>
                  <th>Score</th>
                  <th>Title</th>
                  <th>Creator</th>
                  <th>Year</th>
                  <th>Medium</th>
                  <th>Discovered</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {candidates.map(candidate => (
                  <tr key={candidate.id}>
                    <td>
                      <span className="font-semibold text-stone-900">{candidate.signal_score}</span>
                    </td>
                    <td className="font-serif font-semibold">
                      {candidate.title || <span className="text-stone-400">Untitled</span>}
                    </td>
                    <td>{candidate.creator || <span className="text-stone-400">—</span>}</td>
                    <td>{candidate.year || <span className="text-stone-400">—</span>}</td>
                    <td>
                      {candidate.medium_guess ? (
                        <span className="badge">{candidate.medium_guess}</span>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>
                    <td className="text-xs text-stone-500">
                      {new Date(candidate.discovered_at).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`badge ${
                        candidate.status === 'new' ? 'badge-new' :
                        candidate.status === 'watching' ? 'badge-watching' :
                        candidate.status === 'promoted' ? 'badge-promoted' :
                        candidate.status === 'rejected' ? 'badge-rejected' :
                        ''
                      }`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td>
                      <Link 
                        href={`/candidates/${candidate.id}`}
                        className="text-xs uppercase tracking-wider hover:text-stone-600 transition-colors"
                      >
                        Review →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
