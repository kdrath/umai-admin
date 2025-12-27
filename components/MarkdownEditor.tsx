'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export default function MarkdownEditor({ 
  value, 
  onChange, 
  placeholder,
  minHeight = '150px'
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div className="border border-stone-300 bg-white">
      {/* Tabs */}
      <div className="flex border-b border-stone-200 bg-stone-50">
        <button
          type="button"
          onClick={() => setShowPreview(false)}
          className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
            !showPreview 
              ? 'bg-white text-stone-900 border-b-2 border-stone-900' 
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
            showPreview 
              ? 'bg-white text-stone-900 border-b-2 border-stone-900' 
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Preview
        </button>
        <div className="flex-1 border-b border-stone-200" />
      </div>

      {/* Content */}
      <div className="p-3">
        {!showPreview ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full font-mono text-sm resize-y focus:outline-none"
            style={{ minHeight }}
          />
        ) : (
          <div 
            className="prose prose-stone prose-sm max-w-none min-h-[150px]"
            style={{ minHeight }}
          >
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value}
              </ReactMarkdown>
            ) : (
              <div className="text-stone-400 italic">Nothing to preview</div>
            )}
          </div>
        )}
      </div>

      {/* Help */}
      {!showPreview && (
        <div className="px-3 pb-2 text-xs text-stone-500 border-t border-stone-100 pt-2">
          <span className="font-mono">**bold**</span>
          <span className="mx-2">·</span>
          <span className="font-mono">*italic*</span>
          <span className="mx-2">·</span>
          <span className="font-mono">## heading</span>
          <span className="mx-2">·</span>
          <span className="font-mono">- list</span>
          <span className="mx-2">·</span>
          <span className="font-mono">[link](url)</span>
        </div>
      )}
    </div>
  )
}
