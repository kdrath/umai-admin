import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database tables
export type DiscoveryCandidate = {
  id: string
  source_id: string
  discovered_at: string
  title: string | null
  creator: string | null
  year: number | null
  medium_guess: string | null
  medium_final: string | null
  country: string | null
  language: string | null
  canonical_url: string | null
  source_url: string
  evidence_snippet: string | null
  signal_score: number
  confidence: number
  fingerprint: string | null
  cluster_key: string | null
  cluster_size: number
  seen_count: number
  first_seen_at: string
  last_seen_at: string
  corroboration_sources: string[]
  status: 'new' | 'watching' | 'reviewing' | 'approved' | 'rejected' | 'promoted'
  next_review_at: string | null
  triage_notes: string | null
  reviewed_at: string | null
  reviewed_by: string | null
  promoted_at: string | null
  promoted_work_id: string | null
  raw_payload: any
  created_at: string
  updated_at: string
}

export type Work = {
  id: string
  title: string
  creator: string | null
  year: number | null
  medium: 'Film' | 'Game' | 'Book' | 'Zine' | 'Audio' | 'Art' | 'Other' | null
  country: string | null
  language: string | null
  runtime: string | null
  score_narrative: number | null
  score_formal: number | null
  score_exclusion: number | null
  score_preservation: number | null
  score_total: number | null
  desc_narrative: string | null
  desc_formal: string | null
  desc_exclusion: string | null
  desc_preservation: string | null
  circ_distribution: string | null
  circ_audiences: string | null
  circ_institutional: string | null
  pres_copies: string | null
  pres_condition: string | null
  pres_urgency: 'LOW' | 'MODERATE' | 'HIGH' | null
  critical_notes: string | null
  access_availability: string | null
  access_scholarship: string | null
  discovery_candidate_id: string | null
  discovery_source_urls: string[] | null
  discovery_evidence: string | null
  discovery_date: string | null
  evaluation_status: 'draft' | 'in_progress' | 'complete' | 'published'
  created_at: string
  updated_at: string
  published_at: string | null
}

export type DiscoverySource = {
  id: string
  name: string
  type: 'serp_query' | 'watch_url' | 'rss' | 'api' | 'custom_scrape'
  enabled: boolean
  config: any
  tags: string[]
  quality_weight: number
  schedule_type: 'hourly_6' | 'hourly_4' | 'daily' | 'weekly'
  last_run_at: string | null
  created_at: string
  updated_at: string
}
