import { NextRequest, NextResponse } from 'next/server';
import { 
  exchangeCodeForTokens, 
  getUserInfo, 
  createSessionData,
  GOOGLE_OAUTH_CONFIG 
} from '@/lib/google-auth';
import { setSession } from '@/lib/session';
import supabase from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  console.log('🔄 OAuth callback route called');
  console.log('🔄 Full request URL:', request.url);
  
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  console.log('🔄 Callback parameters:', {
    hasCode: !!code,
    hasState: !!state,
    hasError: !!error,
    error,
    codeLength: code?.length,
    stateLength: state?.length
  });

  // Handle OAuth errors
  if (error) {
    console.error('❌ OAuth error:', error);
    return NextResponse.redirect(new URL('/auth/login?error=oauth_error', request.url));
  }

  // Validate required parameters
  if (!code) {
    console.error('❌ No authorization code received');
    return NextResponse.redirect(new URL('/auth/login?error=no_code', request.url));
  }

  try {
    console.log('🔄 Starting token exchange...');
    
    // Exchange authorization code for tokens
    const tokens = await exchangeCodeForTokens(code);
    
    console.log('🔄 Token exchange result:', {
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token,
      expiresIn: tokens.expires_in,
      tokenType: tokens.token_type
    });
    
    if (!tokens.access_token) {
      throw new Error('No access token received');
    }

    console.log('🔄 Getting user info...');
    
    // Get user information from Google
    const user = await getUserInfo(tokens.access_token);
    
    console.log('🔄 User info received:', {
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      userPicture: !!user.picture
    });
    
    // Check if user exists in users table and insert if not
    console.log('🔄 Checking user profile in database...');
    let userProfileId: string;
    
    try {
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Error checking user profile:', checkError);
      }

      if (!existingUser) {
        console.log('🔄 User not found in users table, creating new profile...');
        
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,                    // Google user "sub" ID (TEXT)
            email: user.email,              // User's email
            display_name: user.name,        // User's display name
            avatar_url: user.picture,       // User's avatar URL
            created_at: new Date().toISOString() // First login timestamp
          });

        if (insertError) {
          console.error('❌ Failed to create user profile:', insertError);
          userProfileId = user.id; // Fallback to Google user ID
        } else {
          console.log('✅ User profile created successfully');
          userProfileId = user.id;
        }
      } else {
        console.log('✅ User profile already exists');
        userProfileId = existingUser.id;
      }
    } catch (profileError) {
      console.error('❌ Error in user profile management:', profileError);
      userProfileId = user.id; // Fallback to Google user ID
    }
    
    console.log('🔄 Creating session data...');
    
    // Create session data with user profile ID
    const sessionData = createSessionData(user, tokens, userProfileId);
    
    console.log('🔄 Session data created:', {
      userId: sessionData.user?.id,
      userEmail: sessionData.user?.email,
      hasAccessToken: !!sessionData.access_token,
      hasRefreshToken: !!sessionData.refresh_token,
      expiresAt: new Date(sessionData.expires_at).toISOString()
    });
    
    // Parse state to get redirect URL
    let redirectUrl = '/dashboard';
    if (state) {
      try {
        const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
        redirectUrl = stateData.next || '/dashboard';
        console.log('🔄 Parsed state data:', stateData);
      } catch (error) {
        console.error('❌ Error parsing state:', error);
      }
    }

    console.log('🔄 Final redirect URL:', redirectUrl);

    // Create response with redirect
    const response = NextResponse.redirect(new URL(redirectUrl, request.url));
    
    console.log('🔄 Setting session cookie...');
    
    // Set session cookie
    setSession(sessionData, response);
    
    console.log('✅ Authentication successful, redirecting to:', redirectUrl);
    console.log('✅ Response headers:', Object.fromEntries(response.headers.entries()));
    
    return response;
  } catch (error) {
    console.error('❌ Authentication error:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.redirect(new URL('/auth/login?error=auth_failed', request.url));
  }
} 