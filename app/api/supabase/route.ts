import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const { table, data, operation } = await request.json()

    if (!table || !data || !operation) {
      return NextResponse.json(
        { error: 'Table, data, and operation are required' },
        { status: 400 }
      )
    }

    let result

    switch (operation) {
      case 'insert':
        result = await supabase.from(table).insert(data)
        break
      case 'select':
        result = await supabase.from(table).select()
        break
      case 'update':
        result = await supabase.from(table).update(data)
        break
      case 'delete':
        result = await supabase.from(table).delete()
        break
      default:
        return NextResponse.json(
          { error: 'Invalid operation' },
          { status: 400 }
        )
    }

    if (result.error) {
      throw result.error
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('Supabase Error:', error)
    return NextResponse.json(
      { error: 'Database operation failed' },
      { status: 500 }
    )
  }
} 