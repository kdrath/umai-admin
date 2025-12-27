'use client'

import { useEffect, useState } from 'react'
import { supabase, type DiscoverySource } from '@/lib/supabase'
import Link from 'next/link'
import Header from '@/components/Header'

export default function SourcesPage() {
  const [sources, setSources] = useState<DiscoverySource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSources()
  }, [])

  async function loadSources() {
    const { data } = await supabase
      .from('discovery_sources')
      .select('*')
      .order('quality_weight', { ascending: false })
    
    setSources(data || [])
    setLoading(false)
  }

  async function toggleSource(id: string, enabled: boolean) {
    await supabase
      .from('discovery_sources')
      .update({ enabled: !enabled })
      .eq('id', id)
    
    loadSources()
  }

  async function updateWeight(id: string, weight: number) {
    await supabase
      .from('discovery_sources')
      .update({ quality_weight: weight })
      .eq('id', id)
    
    loadSources()
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen archival-grid">
      <Header currentPage="sources" />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-semibold mb-2">Discovery Sources</h2>
          <p className="text-sm text-stone-600">
            Configure and manage what the collectors monitor
          </p>
        </div>

        <div className="card overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Name</th>
                <th>Type</th>
                <th>Quality Weight</th>
                <th>Schedule</th>
                <th>Tags</th>
                <th>Last Run</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sources.map(source => (
                <tr key={source.id}>
                  <td>
                    <button
                      onClick={() => toggleSource(source.id, source.enabled)}
                      className={`w-16 h-8 rounded-full transition-colors ${
                        source.enabled 
                          ? 'bg-green-600' 
                          : 'bg-stone-300'
                      }`}
                    >
                      <div className={`w-6 h-6 bg-white rounded-full transition-transform ${
                        source.enabled 
                          ? 'translate-x-9' 
                          : 'translate-x-1'
                      }`} />
                    </button>
                  </td>
                  <td className="font-serif font-semibold">
                    {source.name}
                  </td>
                  <td>
                    <span className="badge">{source.type}</span>
                  </td>
                  <td>
                    <input 
                      type="number"
                      min="-20"
                      max="30"
                      value={source.quality_weight}
                      onChange={(e) => updateWeight(source.id, parseInt(e.target.value))}
                      className="input w-20 text-center"
                    />
                  </td>
                  <td>
                    <span className="badge">{source.schedule_type}</span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {source.tags.map(tag => (
                        <span key={tag} className="badge text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="text-xs text-stone-500">
                    {source.last_run_at 
                      ? new Date(source.last_run_at).toLocaleString()
                      : 'Never'
                    }
                  </td>
                  <td>
                    <button className="text-xs uppercase tracking-wider hover:text-stone-600 transition-colors">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 card p-6 bg-stone-100 border-stone-300">
          <h3 className="font-serif font-semibold mb-2">Quality Weight Guide</h3>
          <div className="text-xs space-y-1 text-stone-600">
            <div><strong>25-30:</strong> Highly curated sources (major festivals)</div>
            <div><strong>15-20:</strong> Good quality sources (respected critics, archives)</div>
            <div><strong>5-10:</strong> General sources (platforms, aggregators)</div>
            <div><strong>0-5:</strong> Noisy sources (experimental, needs filtering)</div>
            <div><strong>-10 to -1:</strong> Known problematic sources (reduce signal)</div>
          </div>
        </div>
      </main>
    </div>
  )
}
