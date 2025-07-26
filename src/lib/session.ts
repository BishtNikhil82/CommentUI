import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { SessionData, COOKIE_CONFIG, refreshAccessToken, isTokenExpired } from './google-auth';

// Get session from cookies
export async function getSession(request?: NextRequest): Promise<SessionData | null> {
  console.log('🍪 Getting session from cookies...');
  
  try {
    const cookieStore = request ? request.cookies : cookies();
    const sessionCookie = cookieStore.get(COOKIE_CONFIG.name);
    
    console.log('🍪 Session cookie found:', !!sessionCookie?.value);
    
    if (!sessionCookie?.value) {
      console.log('❌ No session cookie found');
      return null;
    }

    const sessionData: SessionData = JSON.parse(sessionCookie.value);
    console.log('🍪 Parsed session data:', {
      userId: sessionData.user?.id,
      userEmail: sessionData.user?.email,
      hasAccessToken: !!sessionData.access_token,
      hasRefreshToken: !!sessionData.refresh_token,
      expiresAt: new Date(sessionData.expires_at).toISOString()
    });
    
    // Check if token is expired
    if (isTokenExpired(sessionData.expires_at)) {
      console.log('⏰ Token is expired, attempting refresh...');
      
      // Try to refresh the token
      if (sessionData.refresh_token) {
        try {
          const newTokens = await refreshAccessToken(sessionData.refresh_token);
          const updatedSession: SessionData = {
            ...sessionData,
            access_token: newTokens.access_token,
            expires_at: Date.now() + newTokens.expires_in * 1000,
          };
          console.log('✅ Token refreshed successfully');
          return updatedSession;
        } catch (error) {
          console.error('❌ Failed to refresh token:', error);
          return null;
        }
      } else {
        console.log('❌ No refresh token available');
        return null;
      }
    }

    console.log('✅ Session is valid');
    return sessionData;
  } catch (error) {
    console.error('❌ Error parsing session:', error);
    return null;
  }
}

// Set session in cookies
export function setSession(sessionData: SessionData, response: NextResponse): NextResponse {
  console.log('🍪 Setting session cookie...');
  
  const cookieValue = JSON.stringify(sessionData);
  
  response.cookies.set(COOKIE_CONFIG.name, cookieValue, {
    httpOnly: COOKIE_CONFIG.httpOnly,
    secure: COOKIE_CONFIG.secure,
    sameSite: COOKIE_CONFIG.sameSite,
    maxAge: COOKIE_CONFIG.maxAge,
    path: COOKIE_CONFIG.path,
  });

  console.log('✅ Session cookie set successfully');
  return response;
}

// Clear session (logout)
export function clearSession(response: NextResponse): NextResponse {
  console.log('🍪 Clearing session cookie...');
  
  response.cookies.delete(COOKIE_CONFIG.name);
  
  console.log('✅ Session cookie cleared');
  return response;
}

// Validate session and refresh if needed
export async function validateAndRefreshSession(request?: NextRequest): Promise<{
  session: SessionData | null;
  response?: NextResponse;
}> {
  console.log('🔍 Validating and refreshing session...');
  
  const session = await getSession(request);
  
  if (!session) {
    console.log('❌ No valid session found');
    return { session: null };
  }

  // If token was refreshed, we need to update the cookie
  if (isTokenExpired(session.expires_at - 60000)) { // Refresh if expires within 1 minute
    console.log('⏰ Token expires soon, refreshing...');
    
    if (session.refresh_token) {
      try {
        const newTokens = await refreshAccessToken(session.refresh_token);
        const updatedSession: SessionData = {
          ...session,
          access_token: newTokens.access_token,
          expires_at: Date.now() + newTokens.expires_in * 1000,
        };

        const response = NextResponse.next();
        setSession(updatedSession, response);
        
        console.log('✅ Session refreshed and cookie updated');
        return { session: updatedSession, response };
      } catch (error) {
        console.error('❌ Failed to refresh session:', error);
        return { session: null };
      }
    }
  }

  console.log('✅ Session is valid and up to date');
  return { session };
} 