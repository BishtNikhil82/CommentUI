import { NextRequest, NextResponse } from 'next/server';
import { clearSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/', request.url));
  
  // Clear the session cookie
  clearSession(response);
  
  return response;
} 