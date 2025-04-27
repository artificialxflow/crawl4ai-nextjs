'use client'

import { useState } from 'react'
import Navigation from './components/Navigation'
import UrlInput from './components/scraper/UrlInput'
import FieldSelector from './components/scraper/FieldSelector'
import ResultsDisplay from './components/scraper/ResultsDisplay'

interface Field {
  name: string
  description: string
}

interface ScrapedData {
  data: any
  timestamp: string
}

function ErrorAlert({ message, onClose }: { message: string, onClose: () => void }) {
  if (!message) return null
  return (
    <div style={{
      background: '#fee2e2',
      border: '1px solid #ef4444',
      color: '#dc2626',
      borderRadius: '0.5rem',
      padding: '1rem',
      margin: '2rem auto',
      maxWidth: 800,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '1rem',
      boxShadow: '0 2px 8px rgba(239,68,68,0.08)'
    }}>
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#dc2626',
          fontWeight: 700,
          fontSize: '1.25rem',
          cursor: 'pointer',
          marginLeft: '1rem',
        }}
        aria-label="Close error"
      >
        ×
      </button>
    </div>
  )
}

export default function Home() {
  const [results, setResults] = useState<ScrapedData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fields, setFields] = useState<Field[]>([])

  const handleUrlSubmit = async (url: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Step 1: Crawl the URL
      const crawlResponse = await fetch('/api/crawl4ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!crawlResponse.ok) {
        const errorData = await crawlResponse.json()
        throw new Error(errorData.error || 'Failed to scrape URL')
      }

      const { data: crawledData } = await crawlResponse.json()

      // Step 2: Extract data using LLM
      const extractResponse = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: crawledData,
          fields,
          model: 'gpt-4', // Default to GPT-4
        }),
      })

      if (!extractResponse.ok) {
        const errorData = await extractResponse.json()
        throw new Error(errorData.error || 'Failed to extract data')
      }

      const { extractedData } = await extractResponse.json()

      setResults(prev => [{
        data: extractedData,
        timestamp: new Date().toISOString()
      }, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Universal Web Scraper
          </h1>
          
          <UrlInput
            onUrlSubmit={handleUrlSubmit}
            isLoading={isLoading}
            disabled={fields.length === 0}
          />

          <FieldSelector
            fields={fields}
            onFieldsChange={setFields}
          />

          <ErrorAlert message={error || ''} onClose={() => setError(null)} />

          <ResultsDisplay
            results={results}
            isLoading={isLoading}
            error={null}
          />
        </div>
      </main>
    </>
  )
}
