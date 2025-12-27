'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import Header from '@/components/Header'
import MarkdownEditor from '@/components/MarkdownEditor'

export interface Work {
  id: string
  title: string
  creator?: string
  year?: number | null
  medium?: string
  country?: string
  language?: string
  runtime?: string
  evaluation_status?: string
  score_total?: number | null
  score_narrative?: number | null
  score_formal?: number | null
  score_exclusion?: number | null
  score_preservation?: number | null
  desc_narrative?: string
  desc_formal?: string
  desc_exclusion?: string
  desc_preservation?: string
  circ_distribution?: string
  circ_audiences?: string
  circ_institutional?: string
  pres_copies?: string
  pres_condition?: string
  pres_urgency?: string
  critical_notes?: string
  access_availability?: string
  access_scholarship?: string
  published_at?: string
}

export default function WorkDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [work, setWork] = useState<Work | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadWork()
  }, [params.id])

  async function loadWork() {
    const supabase = createClient()
    const { data } = await supabase
      .from('works')
      .select('*')
      .eq('id', params.id)
      .single()
    
    setWork(data)
    setLoading(false)
  }

  async function saveWork() {
    if (!work) return
    
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('works')
      .update(work)
      .eq('id', work.id)
    
    if (error) {
      alert('Error saving: ' + error.message)
    } else {
      alert('Saved successfully')
    }
    setSaving(false)
  }

  async function publishWork() {
    if (!work) return
    
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('works')
      .update({
        ...work,
        evaluation_status: 'published',
        published_at: new Date().toISOString(),
      })
      .eq('id', work.id)
    
    if (error) {
      alert('Error publishing: ' + error.message)
    } else {
      setWork({ ...work, evaluation_status: 'published' })
      alert('Published successfully')
    }
    setSaving(false)
  }

  if (loading || !work) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen archival-grid">
      <Header currentPage="works" />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-6">
          <Link href="/works" className="text-xs uppercase tracking-wider hover:text-stone-600 transition-colors">
            ← Back to Works
          </Link>
        </div>

        {/* Header */}
        <div className="card p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="label">Catalog ID</div>
              <div className="text-sm text-stone-600 mb-4">{work.id}</div>
              
              <span className={`badge ${
                work.evaluation_status === 'published' ? 'badge-promoted' :
                work.evaluation_status === 'in_progress' ? 'badge-watching' :
                'badge-new'
              }`}>
                {work.evaluation_status}
              </span>
            </div>
            
            {work.score_total !== null && (
              <div className="text-center">
                <div className="text-4xl font-serif font-semibold text-stone-900 mb-1">
                  {work.score_total}/12
                </div>
                <div className="text-xs uppercase tracking-wider text-stone-500">Total Score</div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">Title *</label>
              <input 
                type="text"
                className="input"
                value={work.title}
                onChange={(e) => setWork({ ...work, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Creator</label>
                <input 
                  type="text"
                  className="input"
                  value={work.creator || ''}
                  onChange={(e) => setWork({ ...work, creator: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Year</label>
                <input 
                  type="number"
                  className="input"
                  value={work.year || ''}
                  onChange={(e) => setWork({ ...work, year: parseInt(e.target.value) || null })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">Medium</label>
                <select 
                  className="select"
                  value={work.medium || ''}
                  onChange={(e) => setWork({ ...work, medium: e.target.value as any })}
                >
                  <option value="">Select...</option>
                  <option value="Film">Film</option>
                  <option value="Game">Game</option>
                  <option value="Book">Book</option>
                  <option value="Zine">Zine</option>
                  <option value="Audio">Audio</option>
                  <option value="Art">Art</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="label">Country</label>
                <input 
                  type="text"
                  className="input"
                  value={work.country || ''}
                  onChange={(e) => setWork({ ...work, country: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Language</label>
                <input 
                  type="text"
                  className="input"
                  value={work.language || ''}
                  onChange={(e) => setWork({ ...work, language: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label">Runtime</label>
              <input 
                type="text"
                className="input"
                placeholder="e.g., 90 minutes"
                value={work.runtime || ''}
                onChange={(e) => setWork({ ...work, runtime: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Rubric Scores */}
        <div className="card p-8 mb-6">
          <h3 className="text-xl font-serif font-semibold mb-6">Rubric Evaluation</h3>
          
          <div className="space-y-6">
            {/* Narrative */}
            <div className="pb-6 border-b border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <label className="label">1. Narrative Innovation</label>
                <select 
                  className="select w-32"
                  value={work.score_narrative || ''}
                  onChange={(e) => setWork({ ...work, score_narrative: parseInt(e.target.value) || null })}
                >
                  <option value="">Score</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
              <MarkdownEditor
                value={work.desc_narrative || ''}
                onChange={(value) => setWork({ ...work, desc_narrative: value })}
                placeholder="Describe narrative approach and innovation..."
              />
            </div>

            {/* Formal */}
            <div className="pb-6 border-b border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <label className="label">2. Formal Experimentation</label>
                <select 
                  className="select w-32"
                  value={work.score_formal || ''}
                  onChange={(e) => setWork({ ...work, score_formal: parseInt(e.target.value) || null })}
                >
                  <option value="">Score</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
              <MarkdownEditor
                value={work.desc_formal || ''}
                onChange={(value) => setWork({ ...work, desc_formal: value })}
                placeholder="Describe formal techniques and experimentation..."
              />
            </div>

            {/* Exclusion */}
            <div className="pb-6 border-b border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <label className="label">3. Institutional Exclusion</label>
                <select 
                  className="select w-32"
                  value={work.score_exclusion || ''}
                  onChange={(e) => setWork({ ...work, score_exclusion: parseInt(e.target.value) || null })}
                >
                  <option value="">Score</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
              <MarkdownEditor
                value={work.desc_exclusion || ''}
                onChange={(value) => setWork({ ...work, desc_exclusion: value })}
                placeholder="Describe institutional dismissal and exclusion..."
              />
            </div>

            {/* Preservation */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="label">4. Preservation Urgency</label>
                <select 
                  className="select w-32"
                  value={work.score_preservation || ''}
                  onChange={(e) => setWork({ ...work, score_preservation: parseInt(e.target.value) || null })}
                >
                  <option value="">Score</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
              <MarkdownEditor
                value={work.desc_preservation || ''}
                onChange={(value) => setWork({ ...work, desc_preservation: value })}
                placeholder="Describe preservation risk and urgency..."
              />
            </div>
          </div>
        </div>

        {/* Circulation */}
        <div className="card p-8 mb-6">
          <h3 className="text-xl font-serif font-semibold mb-6">Circulation History</h3>
          
          <div className="space-y-4">
            <div>
              <label className="label">Distribution</label>
              <textarea 
                className="textarea"
                placeholder="How was this work distributed? Theatrical, streaming, self-published..."
                value={work.circ_distribution || ''}
                onChange={(e) => setWork({ ...work, circ_distribution: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Audiences</label>
              <textarea 
                className="textarea"
                placeholder="Who engaged with this work? Festival audiences, niche communities..."
                value={work.circ_audiences || ''}
                onChange={(e) => setWork({ ...work, circ_audiences: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Institutional Response</label>
              <textarea 
                className="textarea"
                placeholder="How did institutions respond? Awards, bans, dismissal..."
                value={work.circ_institutional || ''}
                onChange={(e) => setWork({ ...work, circ_institutional: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Preservation Status */}
        <div className="card p-8 mb-6">
          <h3 className="text-xl font-serif font-semibold mb-6">Preservation Status</h3>
          
          <div className="space-y-4">
            <div>
              <label className="label">Known Copies</label>
              <textarea 
                className="textarea"
                placeholder="Where does this work exist? Physical media, digital files, archives..."
                value={work.pres_copies || ''}
                onChange={(e) => setWork({ ...work, pres_copies: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Condition</label>
              <textarea 
                className="textarea"
                placeholder="Condition of known copies..."
                value={work.pres_condition || ''}
                onChange={(e) => setWork({ ...work, pres_condition: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Urgency</label>
              <select 
                className="select"
                value={work.pres_urgency || ''}
                onChange={(e) => setWork({ ...work, pres_urgency: e.target.value as any })}
              >
                <option value="">Select urgency...</option>
                <option value="LOW">LOW</option>
                <option value="MODERATE">MODERATE</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>
          </div>
        </div>

        {/* Critical Analysis */}
        <div className="card p-8 mb-6">
          <h3 className="text-xl font-serif font-semibold mb-6">Critical Analysis</h3>
          
          <div className="space-y-4">
            <div>
              <label className="label">Critical Notes</label>
              <MarkdownEditor
                value={work.critical_notes || ''}
                onChange={(value) => setWork({ ...work, critical_notes: value })}
                placeholder="Your analytical notes on this work..."
                minHeight="200px"
              />
            </div>

            <div>
              <label className="label">Access & Availability</label>
              <textarea 
                className="textarea"
                placeholder="How can people access this work today?"
                value={work.access_availability || ''}
                onChange={(e) => setWork({ ...work, access_availability: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Existing Scholarship</label>
              <textarea 
                className="textarea"
                placeholder="What has been written about this work?"
                value={work.access_scholarship || ''}
                onChange={(e) => setWork({ ...work, access_scholarship: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button 
            onClick={saveWork}
            disabled={saving}
            className="btn btn-secondary flex-1"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          
          {work.evaluation_status !== 'published' && (
            <button 
              onClick={publishWork}
              disabled={saving}
              className="btn btn-primary flex-1"
            >
              Publish to Catalog
            </button>
          )}
          
          {work.evaluation_status === 'published' && (
            <div className="flex-1 flex items-center justify-center">
              <span className="stamp text-green-700">Published</span>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}