// app/api/analytics/route.ts

import { NextRequest } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })

  const { data: { session }, error: sessionError } = await supabase.auth.getSession()

  if (sessionError || !session || !session.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const youtubeToken = session.provider_token
  if (!youtubeToken) {
    return new Response(JSON.stringify({
      error: 'YouTube token not found. Please re-authenticate.',
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const body = await request.json()
  const query = body.query

  if (!query || typeof query !== 'string') {
    return new Response(JSON.stringify({ error: 'Query is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  const backendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000'
  const encoder = new TextEncoder()
  console.log("Now Calling for python Server")
  const stream = new ReadableStream({
    async start(controller) {
      try {
          const url = new URL(`${backendUrl}/analyze-youtube`);
          url.searchParams.set("query", query); // e.g., query = "dhruv Rathee"
          url.searchParams.set("maxResults", "5");
          url.searchParams.set("order", "relevance");
          url.searchParams.set("regionCode", "IN");
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${youtubeToken}`,
            }
          });
        const reader = response.body?.getReader()
        if (!reader) throw new Error('No response body')
        const decoder = new TextDecoder()
        let buffer = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              controller.enqueue(encoder.encode(`${line}\n\n`))
            }
          }
        }

        const doneMsg = JSON.stringify({
          type: 'complete',
          data: { message: 'Analysis complete' }
        })
        controller.enqueue(encoder.encode(`data: ${doneMsg}\n\n`))
      } catch (err) {
        console.error('Streaming error:', err)
        const errMsg = JSON.stringify({
          type: 'error',
          data: { error: err instanceof Error ? err.message : 'Unknown error' }
        })
        controller.enqueue(encoder.encode(`data: ${errMsg}\n\n`))
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
    }
  })
}