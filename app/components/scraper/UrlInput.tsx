'use client'

import { useState } from 'react'
import styles from './UrlInput.module.css'

interface UrlInputProps {
  onUrlSubmit: (url: string) => Promise<void>
  isLoading: boolean
  disabled?: boolean
}

export default function UrlInput({ onUrlSubmit, isLoading, disabled = false }: UrlInputProps) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      new URL(url) // Basic URL validation
      await onUrlSubmit(url)
      setUrl('')
    } catch (err) {
      setError('Please enter a valid URL')
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to scrape"
          className={styles.input}
          disabled={isLoading || disabled}
          required
        />
        <button
          type="submit"
          className={styles.button}
          disabled={isLoading || disabled}
        >
          {isLoading ? 'Scraping...' : 'Scrape'}
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
} 