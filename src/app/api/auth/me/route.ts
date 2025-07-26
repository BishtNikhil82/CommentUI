import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  console.log('👤 /api/auth/me route called');
  
  try {
    const session = await getSession(request);
    
    if (!session) {
      console.log('❌ No session found in /api/auth/me');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ Session found in /api/auth/me:', {
      userId: session.user.id,
      userEmail: session.user.email,
      hasAccessToken: !!session.access_token,
      expiresAt: new Date(session.expires_at).toISOString()
    });

    return NextResponse.json({
      user: session.user,
      access_token: session.access_token,
      expires_at: session.expires_at,
    });
  } catch (error) {
    console.error('❌ Error in /api/auth/me:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 