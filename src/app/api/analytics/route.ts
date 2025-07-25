// app/api/analytics/route.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookies().getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const youtubeToken = session.provider_token;
  if (!youtubeToken) {
    return NextResponse.json({ error: 'YouTube token not found. Please re-authenticate.' }, { status: 401 });
  }

  const body = await request.json();
  const topic = body.query;

  if (!topic || typeof topic !== 'string') {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  const backendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';
  console.log("Now Calling for Python Server");

  try {
    const jobId = uuidv4();

    const { error: insertError } = await supabase.from('jobs').insert({
      id: jobId,
      topic,
      user_id: session.user.id,
      status: 'processing',
    });

    if (insertError) {
      throw new Error(`Failed to insert job: ${insertError.message}`);
    }

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
      console.error('Background fetch to Python server failed:', err);
    });

    return NextResponse.json({ job_id: jobId }, { status: 202 });
  } catch (err) {
    console.error('Fetch error:', err);
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}
