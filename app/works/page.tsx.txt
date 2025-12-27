'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import Header from '@/components/Header'

export interface Work {
  id: string
  title: string
  creator?: string
  year?: string
  medium?: string
  evaluation_status?: string
  score_total?: number | null
  critical_notes?: string
}

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadWorks()
  }, [statusFilter])

  async function loadWorks() {
    setLoading(true)
    const supabase = createClient()
    
    let query = supabase
      .from('works')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (statusFilter !== 'all') {
      query = query.eq('evaluation_status', statusFilter)
    }
    
    const { data } = await query
    setWorks(data || [])
    setLoading(false)
  }

  return (
    <div className="min-h-screen archival-grid">
      <Header currentPage="works" />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-serif font-semibold mb-2">Catalog Works</h2>
            <p className="text-sm text-stone-600">Evaluate and publish works to the public catalog</p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setStatusFilter('all')}
              className={`btn ${statusFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All
            </button>
            <button 
              onClick={() => setStatusFilter('draft')}
              className={`btn ${statusFilter === 'draft' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Draft
            </button>
            <button 
              onClick={() => setStatusFilter('in_progress')}
              className={`btn ${statusFilter === 'in_progress' ? 'btn-primary' : 'btn-secondary'}`}
            >
              In Progress
            </button>
            <button 
              onClick={() => setStatusFilter('published')}
              className={`btn ${statusFilter === 'published' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Published
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-stone-500">Loading works...</div>
        ) : works.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-stone-500 mb-4">No works yet</div>
            <p className="text-xs text-stone-400">Promote candidates to start building your catalog</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {works.map(work => (
              <Link 
                key={work.id} 
                href={`/works/${work.id}`}
                className="card p-6 hover:border-stone-900 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`badge ${
                    work.evaluation_status === 'published' ? 'badge-promoted' :
                    work.evaluation_status === 'in_progress' ? 'badge-watching' :
                    'badge-new'
                  }`}>
                    {work.evaluation_status}
                  </span>
                  {work.score_total !== null && (
                    <span className="text-lg font-serif font-semibold text-stone-900">
                      {work.score_total}/12
                    </span>
                  )}
                </div>
                
                <h3 className="font-serif font-semibold text-lg mb-2 group-hover:text-stone-600 transition-colors">
                  {work.title}
                </h3>
                
                <div className="text-xs text-stone-600 space-y-1">
                  {work.creator && <div>{work.creator}</div>}
                  <div className="flex items-center gap-2">
                    {work.year && <span>{work.year}</span>}
                    {work.medium && <span className="badge">{work.medium}</span>}
                  </div>
                </div>
                
                {work.critical_notes && (
                  <div className="mt-3 text-xs text-stone-500 line-clamp-3">
                    {work.critical_notes}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}