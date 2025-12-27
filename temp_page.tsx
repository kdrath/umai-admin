'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import Header from '@/components/Header'

export interface DiscoveryCandidate {
  id: string
  title: string
  source: string
  source_url: string
  discovered_at: string
  status: 'new' | 'watching' | 'promoted' | 'rejected'
  curator_notes?: string
  medium_guess?: string
  creator?: string
  year?: string
  country?: string
  language?: string
  signal_score?: number
  evidence_snippet?: string
  triage_notes?: string
  promoted_at?: string
  promoted_work_id?: string
  reviewed_at?: string
  next_review_at?: string
}

export default function CandidateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [candidate, setCandidate] = useState<DiscoveryCandidate | null>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadCandidate()
  }, [params.id])

  async function loadCandidate() {
    const supabase = createClient()
    const { data } = await supabase
      .from('discovery_candidates')
      .select('*')
      .eq('id', params.id)
      .single()
    
    setCandidate(data)
    setNotes(data?.triage_notes || '')
    setLoading(false)
  }

  async function promoteToWork() {
    if (!candidate) return
    
    setProcessing(true)
    const supabase = createClient()
    
    const workId = `UMAI-${(candidate.medium_guess || 'WORK').toUpperCase()}-${Date.now().toString().slice(-6)}`
    
    const { error: workError } = await supabase
      .from('works')
      .insert({
        id: workId,
        title: candidate.title || 'Untitled',
        creator: candidate.creator,
        year: candidate.year,
        medium: candidate.medium_guess,
        country: candidate.country,
        language: candidate.language,
        discovery_candidate_id: candidate.id,
        discovery_source_urls: [candidate.source_url],
        discovery_evidence: candidate.evidence_snippet,
        discovery_date: candidate.discovered_at,
        evaluation_status: 'in_progress',
      })
    
    if (workError) {
      alert('Error creating work: ' + workError.message)
      setProcessing(false)
      return
    }
    
    await supabase
      .from('discovery_candidates')
      .update({
        status: 'promoted',
        promoted_at: new Date().toISOString(),
        promoted_work_id: workId,
        triage_notes: notes,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', candidate.id)
    
    setProcessing(false)
    router.push(`/works/${workId}`)
  }

  async function updateStatus(status: string) {
    if (!candidate) return
    
    setProcessing(true)
    const supabase = createClient()
    await supabase
      .from('discovery_candidates')
      .update({
        status,
        triage_notes: notes,
        reviewed_at: new Date().toISOString(),
        next_review_at: status === 'watching' ? 
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : 
          null,
      })
      .eq('id', candidate.id)
    
    setProcessing(false)
    router.push('/candidates')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!candidate) {
    return <div className="min-h-screen flex items-center justify-center">Candidate not found</div>
  }

  return (
    <div className="min-h-screen archival-grid">
      <Header currentPage="candidates" />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-6">
          <Link href="/candidates" className="text-xs uppercase tracking-wider hover:text-stone-600 transition-colors">
            ← Back to Candidates
          </Link>
        </div>

        <div className="card p-8 mb-6">
          <div className="flex items-start justify-between mb-6 pb-6 border-b border-stone-200">
            <div>
              <h2 className="text-3xl font-serif font-semibold mb-2">
                {candidate.title || 'Untitled'}
              </h2>
              <div className="flex items-center gap-4 text-sm text-stone-600">
                {candidate.creator && <span>{candidate.creator}</span>}
                {candidate.year && <span>{candidate.year}</span>}
                {candidate.medium_guess && <span className="badge">{candidate.medium_guess}</span>}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-serif font-semibold text-stone-900 mb-1">
                {candidate.signal_score}
              </div>
              <div className="text-xs uppercase tracking-wider text-stone-500">Signal Score</div>
            </div>
          </div>

          {candidate.evidence_snippet && (
            <div className="mb-6">
              <div className="label">Evidence</div>
              <div className="text-sm leading-relaxed text-stone-700 border-l-2 border-stone-300 pl-4">
                {candidate.evidence_snippet}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="label">Country</div>
              <div className="text-sm">{candidate.country || '—'}</div>
            </div>
            <div>
              <div className="label">Language</div>
              <div className="text-sm">{candidate.language || '—'}</div>
            </div>
            <div>
              <div className="label">Discovered</div>
              <div className="text-sm">{new Date(candidate.discovered_at).toLocaleString()}</div>
            </div>
            <div>
              <div className="label">Status</div>
              <span className={`badge ${
                candidate.status === 'new' ? 'badge-new' :
                candidate.status === 'watching' ? 'badge-watching' :
                candidate.status === 'promoted' ? 'badge-promoted' :
                candidate.status === 'rejected' ? 'badge-rejected' :
                ''
              }`}>
                {candidate.status}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <div className="label">Source URL</div>
            <a 
              href={candidate.source_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-700 hover:text-blue-900 underline break-all"
            >
              {candidate.source_url}
            </a>
          </div>

          <div className="mb-6">
            <label className="label">Triage Notes</label>
            <textarea 
              className="textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your review notes here..."
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={promoteToWork}
            disabled={processing || candidate.status === 'promoted'}
            className="btn btn-primary flex-1"
          >
            {processing ? 'Processing...' : 'Promote to Works'}
          </button>
          <button 
            onClick={() => updateStatus('watching')}
            disabled={processing || candidate.status === 'promoted'}
            className="btn btn-secondary flex-1"
          >
            Mark as Watching
          </button>
          <button 
            onClick={() => updateStatus('rejected')}
            disabled={processing || candidate.status === 'promoted'}
            className="btn btn-danger flex-1"
          >
            Reject
          </button>
        </div>

        {candidate.status === 'promoted' && (
          <div className="mt-4 text-center">
            <Link 
              href={`/works/${candidate.promoted_work_id}`}
              className="text-sm text-blue-700 hover:text-blue-900 underline"
            >
              View promoted work →
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
