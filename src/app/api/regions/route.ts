// app/api/regions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 1. Get session from cookies
    const session = await getSession(request);

    if (!session || !session.access_token) {
      console.warn('[AUTH] Unauthorized access attempt to regions API');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const youtubeToken = session.access_token;
    if (!youtubeToken.startsWith('ya29')) {
      console.warn('[AUTH] Invalid YouTube token for regions API');
      return NextResponse.json({ error: 'YouTube token not found. Please re-authenticate.' }, { status: 401 });
    }

    // 2. Fetch regions from YouTube API
    const regionsUrl = 'https://www.googleapis.com/youtube/v3/i18nRegions';
    const url = new URL(regionsUrl);
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('hl', 'en'); // Get region names in English

    console.log('[REGIONS] Fetching regions from YouTube API:', url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${youtubeToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[REGIONS] YouTube API error:', response.status, errorText);
      return NextResponse.json({ 
        error: 'Failed to fetch regions from YouTube API',
        details: errorText 
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('[REGIONS] Successfully fetched regions:', data.items?.length || 0);

    // 3. Transform the data to a more usable format
    const regions = data.items?.map((item: any) => ({
      code: item.snippet.gl,
      name: item.snippet.name,
    })) || [];

    // 4. Sort regions alphabetically by name
    regions.sort((a: any, b: any) => a.name.localeCompare(b.name));

    return NextResponse.json({ regions });
  } catch (error) {
    console.error('[REGIONS] Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch regions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 