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
    
    // Generate work ID
    const workId = `UMAI-${(candidate.medium_guess || 'WORK').toUpperCase()}-${Date.now().toString().slice(-6)}`
    
    // Create work entry
    const { error: workError } = await supabase
      .from('works')
      .insert({
        id: workId,
        title: candidate.title || 'Untitled',
        creator: candidate.creator,
        year: candidate.year,
        medium: candidate.medium_guess,
        country: candidate.