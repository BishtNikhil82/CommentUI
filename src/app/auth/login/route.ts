import { NextRequest, NextResponse } from 'next/server';
import { generateAuthUrl } from '@/lib/google-auth';

export async function GET(request: NextRequest) {
  console.log('🚀 Login route called');
  
  const { searchParams } = new URL(request.url);
  const next = searchParams.get('next') || '/dashboard';
  
  console.log('🚀 Next redirect URL:', next);
  
  // Generate state parameter to include the redirect URL
  const state = Buffer.from(JSON.stringify({ next })).toString('base64');
  console.log('🚀 Generated state:', state);
  
  // Generate Google OAuth URL
  const authUrl = generateAuthUrl(state);
  
  console.log('🚀 Redirecting to Google OAuth:', authUrl);
  
  // Redirect to Google OAuth
  return NextResponse.redirect(authUrl);
} 