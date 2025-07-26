// app/api/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import supabase from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    // 1. Get session from cookies
    const session = await getSession(request);

    if (!session || !session.access_token || !session.user?.id) {
      console.warn('[AUTH] Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const youtubeToken = session.access_token;
    if (!youtubeToken.startsWith('ya29')) {
      console.warn('[AUTH] Invalid YouTube token:', youtubeToken.slice(0, 6));
      return NextResponse.json({ error: 'YouTube token not found. Please re-authenticate.' }, { status: 401 });
    }

    // 2. Parse and validate body
    const { query: topic } = await request.json();

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json({ error: 'Query must be a non-empty string.' }, { status: 400 });
    }

    // 3. Get user profile ID from session
    const userProfileId = session.user_profile_id;
    if (!userProfileId) {
      console.warn('[AUTH] No user profile ID in session for user:', session.user.id);
      return NextResponse.json({ error: 'User profile not found. Please re-authenticate.' }, { status: 401 });
    }

    console.log('[AUTH] Using user profile ID from session:', userProfileId);

    // 4. Create job in database (ID will be auto-generated)
    console.log(`[JOB] Creating job for topic: ${topic}`);

    // 5. Insert job into Supabase using user profile ID from session
    const { data: jobData, error: insertError } = await supabase.from('jobs').insert({
      user_id: userProfileId, // TEXT reference to users(id)
      topic,                  // The query/search topic
      status: 'processing',   // Default status
      // Note: id is BIGSERIAL (auto-generated), created_at has default
    }).select('id').single();

    if (insertError) {
      console.error('[DB] Failed to insert job:', insertError.message);
      return NextResponse.json({ error: 'Failed to create job entry.' }, { status: 500 });
    }

    const jobId = jobData.id; // Get the auto-generated BIGSERIAL ID
    console.log('[DB] Job inserted successfully:', jobId);

    // 6. Fire async call to Python backend
    const backendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';

    const url = new URL(`${backendUrl}/analyze-youtube`);
    url.searchParams.set('query', topic);
    url.searchParams.set('maxResults', '5');
    url.searchParams.set('order', 'relevance');
    url.searchParams.set('regionCode', 'IN');
    url.searchParams.set('job_id', jobId);

    fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${youtubeToken}`,
      },
    }).then(() => {
      console.log('[PYTHON] Analysis triggered for job:', jobId);
    }).catch((err) => {
      console.error('[PYTHON] Failed to trigger analysis:', err.message);
    });

    // 7. Return job ID
    return NextResponse.json({ job_id: jobId }, { status: 202 });

  } catch (error) {
    console.error('[API] /analytics error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unexpected server error',
    }, { status: 500 });
  }
}
