'use client'

import { useEffect, useState } from 'react'
import { supabase, type DiscoveryCandidate, type Work } from '@/lib/supabase'
import Link from 'next/link'
import Header from '@/components/Header'

export default function Dashboard() {
  const [candidates, setCandidates] = useState<DiscoveryCandidate[]>([])
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    newCandidates: 0,
    watchingCandidates: 0,
    draftWorks: 0,
    publishedWorks: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    
    // Load top candidates by score
    const { data: candidatesData } = await supabase
      .from('discovery_candidates')
      .select('*')
      .eq('status', 'new')
      .order('signal_score', { ascending: false })
      .limit(10)
    
    // Load recent works
    const { data: worksData } = await supabase
      .from('works')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    
    // Load stats
    const { count: newCount } = await supabase
      .from('discovery_candidates')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new')
    
    const { count: watchingCount } = await supabase
      .from('discovery_candidates')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'watching')
    
    const { count: draftCount } = await supabase
      .from('works')
      .select('*', { count: 'exact', head: true })
      .in('evaluation_status', ['draft', 'in_progress'])
    
    const { count: publishedCount } = await supabase
      .from('works')
      .select('*', { count: 'exact', head: true })
      .eq('evaluation_status', 'published')
    
    setCandidates(candidatesData || [])
    setWorks(worksData || [])
    setStats({
      newCandidates: newCount || 0,
      watchingCandidates: watchingCount || 0,
      draftWorks: draftCount || 0,
      publishedWorks: publishedCount || 0,
    })
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-stone-500 font-mono">Loading archive system...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen archival-grid">
      <Header currentPage="dashboard" />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          <div className="card p-6 border-l-4 border-l-blue-600">
            <div className="text-xs uppercase tracking-wider text-stone-500 mb-2">New Candidates</div>
            <div className="text-3xl font-serif font-semibold">{stats.newCandidates}</div>
          </div>
          <div className="card p-6 border-l-4 border-l-amber-600">
            <div className="text-xs uppercase tracking-wider text-stone-500 mb-2">Watching</div>
            <div className="text-3xl font-serif font-semibold">{stats.watchingCandidates}</div>
          </div>
          <div className="card p-6 border-l-4 border-l-purple-600">
            <div className="text-xs uppercase tracking-wider text-stone-500 mb-2">In Progress</div>
            <div className="text-3xl font-serif font-semibold">{stats.draftWorks}</div>
          </div>
          <div className="card p-6 border-l-4 border-l-green-600">
            <div className="text-xs uppercase tracking-wider text-stone-500 mb-2">Published</div>
            <div className="text-3xl font-serif font-semibold">{stats.publishedWorks}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Candidate Queue */}
          <div>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-lg font-serif font-semibold">High-Priority Candidates</h2>
              <Link href="/candidates" className="text-xs uppercase tracking-wider hover:text-stone-600 transition-colors">
                View All →
              </Link>
            </div>
            
            <div className="space-y-3">
              {candidates.length === 0 ? (
                <div className="card p-6 text-center text-stone-500">
                  No new candidates. Collectors will populate this queue.
                </div>
              ) : (
                candidates.map(candidate => (
                  <Link 
                    key={candidate.id} 
                    href={`/candidates/${candidate.id}`}
                    className="card p-4 block hover:border-stone-900 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-serif font-semibold">{candidate.title || 'Untitled'}</div>
                      <span className="badge badge-new text-xs">{candidate.signal_score}</span>
                    </div>
                    <div className="text-xs text-stone-600 mb-2">
                      {candidate.creator && <span className="mr-3">{candidate.creator}</span>}
                      {candidate.year && <span className="mr-3">{candidate.year}</span>}
                      {candidate.medium_guess && <span className="badge">{candidate.medium_guess}</span>}
                    </div>
                    {candidate.evidence_snippet && (
                      <div className="text-xs text-stone-500 line-clamp-2">
                        {candidate.evidence_snippet}
                      </div>
                    )}
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Recent Works */}
          <div>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-lg font-serif font-semibold">Recent Works</h2>
              <Link href="/works" className="text-xs uppercase tracking-wider hover:text-stone-600 transition-colors">
                View All →
              </Link>
            </div>
            
            <div className="space-y-3">
              {works.length === 0 ? (
                <div className="card p-6 text-center text-stone-500">
                  No works yet. Promote candidates to start building your catalog.
                </div>
              ) : (
                works.map(work => (
                  <Link 
                    key={work.id} 
                    href={`/works/${work.id}`}
                    className="card p-4 block hover:border-stone-900 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-serif font-semibold">{work.title}</div>
                      <span className={`badge ${
                        work.evaluation_status === 'published' ? 'badge-promoted' :
                        work.evaluation_status === 'in_progress' ? 'badge-watching' :
                        'badge-new'
                      }`}>
                        {work.evaluation_status}
                      </span>
                    </div>
                    <div className="text-xs text-stone-600 mb-2">
                      {work.creator && <span className="mr-3">{work.creator}</span>}
                      {work.year && <span className="mr-3">{work.year}</span>}
                      {work.medium && <span className="badge">{work.medium}</span>}
                    </div>
                    {work.score_total !== null && (
                      <div className="text-xs text-stone-500">
                        Rubric Score: {work.score_total}/12
                      </div>
                    )}
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
