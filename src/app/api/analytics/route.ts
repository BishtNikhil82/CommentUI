// app/api/analytics/route.ts

import { NextRequest } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'

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
  const topic = body.query

  if (!topic || typeof topic !== 'string') {
    return new Response(JSON.stringify({ error: 'Query is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const backendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000'
  console.log("Now Calling for Python Server")

  try {
    // Step 1: Generate job ID
    const jobId = uuidv4()

    // Step 2: Insert job into jobs table
    const { error: insertError } = await supabase.from('jobs').insert({
      id: jobId,
      topic,
      user_id: session.user.id,
      status: 'processing',
    })

    if (insertError) {
      throw new Error(`Failed to insert job: ${insertError.message}`)
    }

    // Step 3: Fire-and-forget request to Python server with job ID (no await)
    const url = new URL(`${backendUrl}/analyze-youtube`);
    url.searchParams.set("query", topic);
    url.searchParams.set("maxResults", "5");
    url.searchParams.set("order", "relevance");
    url.searchParams.set("regionCode", "IN");
    url.searchParams.set("job_id", jobId);

    fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${youtubeToken}`,
      }
    }).catch(err => {
      console.error('Background fetch to Python server failed:', err)
    });

    // Step 4: Respond with job ID only
    return new Response(JSON.stringify({ job_id: jobId }), {
      status: 202,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Fetch error:', err)
    return new Response(JSON.stringify({
      error: err instanceof Error ? err.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}