import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { query } = await request.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    // Get YouTube token from user metadata
    const youtubeToken = user.user_metadata?.provider_token

    if (!youtubeToken) {
      return NextResponse.json({ 
        error: 'YouTube token not found. Please re-authenticate.' 
      }, { status: 401 })
    }

    // Create a readable stream for Server-Sent Events
    const encoder = new TextEncoder()
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Call Python FastAPI backend
          const backendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000'
          const response = await fetch(`${backendUrl}/analyze`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${youtubeToken}`,
            },
            body: JSON.stringify({ query }),
          })

          if (!response.ok) {
            throw new Error(`Backend error: ${response.status}`)
          }

          const reader = response.body?.getReader()
          if (!reader) {
            throw new Error('No response body')
          }

          try {
            while (true) {
              const { done, value } = await reader.read()
              
              if (done) {
                // Send completion event
                const completionData = JSON.stringify({
                  type: 'complete',
                  data: { message: 'Analysis complete' }
                })
                controller.enqueue(encoder.encode(`data: ${completionData}\n\n`))
                break
              }

              // Forward the chunk from Python backend
              const chunk = new TextDecoder().decode(value)
              const lines = chunk.split('\n')
              
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  controller.enqueue(encoder.encode(`${line}\n\n`))
                }
              }
            }
          } finally {
            reader.releaseLock()
          }
        } catch (error) {
          console.error('Streaming error:', error)
          const errorData = JSON.stringify({
            type: 'error',
            data: { 
              error: error instanceof Error ? error.message : 'Unknown error occurred' 
            }
          })
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
        } finally {
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}