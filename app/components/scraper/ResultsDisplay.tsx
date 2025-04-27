'use client'

import { useState } from 'react'
import styles from './ResultsDisplay.module.css'

interface ScrapedData {
  data: any
  timestamp: string
}

interface ResultsDisplayProps {
  results: ScrapedData[]
  isLoading: boolean
  error: string | null
}

export default function ResultsDisplay({ results, isLoading, error }: ResultsDisplayProps) {
  const [selectedResult, setSelectedResult] = useState<number | null>(null)

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Scraping in progress...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No results yet. Enter a URL to start scraping.</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.resultsList}>
        {results.map((result, index) => (
          <div
            key={result.timestamp}
            className={`${styles.resultItem} ${selectedResult === index ? styles.selected : ''}`}
            onClick={() => setSelectedResult(index)}
          >
            <div className={styles.resultHeader}>
              <span className={styles.timestamp}>
                {new Date(result.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedResult !== null && (
        <div className={styles.resultContent}>
          <pre className={styles.json}>
            {JSON.stringify(results[selectedResult].data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
} 