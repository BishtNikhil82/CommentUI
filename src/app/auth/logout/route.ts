import { NextRequest, NextResponse } from 'next/server';
import { clearSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  console.log('🚪 [LOGOUT] Logout request received');
  
  const response = NextResponse.redirect(new URL('/', request.url));
  
  // Clear the session cookie
  clearSession(response);
  
  console.log('✅ [LOGOUT] Logout completed, redirecting to home');
  
  return response;
} 