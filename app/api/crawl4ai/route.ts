import { NextResponse } from 'next/server'
import axios from 'axios'

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000')
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '60')

// Simple in-memory rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const userData = requestCounts.get(ip)

  if (!userData || now > userData.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  if (userData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true
  }

  userData.count++
  return false
}

// URL validation
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

async function pollCrawlResult(taskId: string, maxAttempts = 10, intervalMs = 2000) {
  const baseUrl = process.env.CRAWL4AI_API_URL?.replace(/\/crawl$/, '')
  const resultUrl = `${baseUrl}/task/${taskId}`
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const res = await axios.get(resultUrl, {
      headers: {
        Authorization: `Bearer ${process.env.CRAWL4AI_API_AUTH}`,
      },
    })
    if (res.data.status === 'completed' && (res.data.markdown || res.data.html)) {
      // Prefer markdown, fallback to html
      return res.data.markdown || res.data.html
    }
    await new Promise(r => setTimeout(r, intervalMs))
  }
  throw new Error('Timed out waiting for crawl result')
}

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'

    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const { url } = await request.json()

    // Validate URL
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Validate crawl4ai API URL
    if (!process.env.CRAWL4AI_API_URL) {
      console.error('CRAWL4AI_API_URL is not configured')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Step 1: Start crawl
    const crawlResponse = await axios.post(
      process.env.CRAWL4AI_API_URL,
      { urls: [url] },
      {
        timeout: 30000,
        headers: {
          Authorization: `Bearer ${process.env.CRAWL4AI_API_AUTH}`,
        },
      }
    )

    if (!crawlResponse.data || !crawlResponse.data.task_id) {
      return NextResponse.json(
        { error: 'Invalid response from crawl4ai server (missing task_id)' },
        { status: 502 }
      )
    }

    // Step 2: Poll for result
    const content = await pollCrawlResult(crawlResponse.data.task_id)

    return NextResponse.json({
      data: content,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Crawl4AI Error:', error)

    // Handle specific error cases
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return NextResponse.json(
          { error: 'Request timeout. The server took too long to respond.' },
          { status: 504 }
        )
      }
      
      if (error.response) {
        return NextResponse.json(
          { error: `Crawl4ai server error: ${error.response.status}` },
          { status: error.response.status }
        )
      }
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to crawl URL' },
      { status: 500 }
    )
  }
} 