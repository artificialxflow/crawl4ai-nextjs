import { NextResponse } from 'next/server'
import { extractData } from '@/app/lib/llm'

export async function POST(request: Request) {
  try {
    const { content, fields, model = 'gpt-4' } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return NextResponse.json(
        { error: 'Fields array is required and must not be empty' },
        { status: 400 }
      )
    }

    // Validate each field has required properties
    for (const field of fields) {
      if (!field.name || !field.description) {
        return NextResponse.json(
          { error: 'Each field must have a name and description' },
          { status: 400 }
        )
      }
    }

    // Validate model
    if (!['gpt-4', 'gemini', 'groq'].includes(model)) {
      return NextResponse.json(
        { error: 'Invalid model specified' },
        { status: 400 }
      )
    }

    const extractedData = await extractData({ content, fields }, model as 'gpt-4' | 'gemini' | 'groq')

    return NextResponse.json({ extractedData })
  } catch (error) {
    console.error('Error in extract API:', error)
    return NextResponse.json(
      { error: 'Failed to extract data' },
      { status: 500 }
    )
  }
} 