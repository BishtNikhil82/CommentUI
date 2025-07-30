// Google OAuth 2.0 Configuration and Types
export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  verified_email: boolean;
}

export interface SessionData {
  user: GoogleUser;
  access_token: string;
  refresh_token?: string;
  expires_at: number;
  user_profile_id?: string; // Add user profile ID to session
}

// Google OAuth endpoints
export const GOOGLE_OAUTH_CONFIG = {
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: (() => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const redirectUri = `${appUrl}/auth/callback`;
    console.log('🔧 Environment check:', {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      appUrl,
      redirectUri
    });
    return redirectUri;
  })(),
  scopes: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.force-ssl'
  ].join(' ')
};

console.log('🔧 GOOGLE_OAUTH_CONFIG:', {
  clientId: GOOGLE_OAUTH_CONFIG.clientId ? 'SET' : 'MISSING',
  clientSecret: GOOGLE_OAUTH_CONFIG.clientSecret ? 'SET' : 'MISSING',
  redirectUri: GOOGLE_OAUTH_CONFIG.redirectUri,
  scopes: GOOGLE_OAUTH_CONFIG.scopes
});

// Cookie configuration
export const COOKIE_CONFIG = {
  name: 'auth_session',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/'
};

// Generate Google OAuth URL
export function generateAuthUrl(state?: string): string {
  console.log('🔗 Generating Google OAuth URL with state:', state);
  
  // Build the URL manually to avoid encoding issues
  const baseUrl = GOOGLE_OAUTH_CONFIG.authUrl;
  const params = new URLSearchParams();
  
  params.append('client_id', GOOGLE_OAUTH_CONFIG.clientId);
  params.append('redirect_uri', GOOGLE_OAUTH_CONFIG.redirectUri);
  params.append('response_type', 'code');
  params.append('scope', GOOGLE_OAUTH_CONFIG.scopes);
  params.append('access_type', 'offline');
  params.append('prompt', 'consent');
  
  if (state) {
    params.append('state', state);
  }

  const authUrl = `${baseUrl}?${params.toString()}`;
  console.log('🔗 Generated OAuth URL:', authUrl);
  console.log('🔗 Redirect URI being sent:', GOOGLE_OAUTH_CONFIG.redirectUri);
  
  return authUrl;
}

// Exchange authorization code for tokens
export async function exchangeCodeForTokens(code: string): Promise<GoogleTokens> {
  console.log('🔄 Exchanging authorization code for tokens...');
  console.log('🔄 Code length:', code.length);
  
  const response = await fetch(GOOGLE_OAUTH_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: GOOGLE_OAUTH_CONFIG.clientId,
      client_secret: GOOGLE_OAUTH_CONFIG.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: GOOGLE_OAUTH_CONFIG.redirectUri,
    }),
  });

  console.log('🔄 Token exchange response status:', response.status);

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Token exchange failed:', error);
    throw new Error(`Token exchange failed: ${error}`);
  }

  const tokens = await response.json();
  console.log('✅ Token exchange successful:', {
    hasAccessToken: !!tokens.access_token,
    hasRefreshToken: !!tokens.refresh_token,
    expiresIn: tokens.expires_in,
    scope: tokens.scope
  });

  return tokens;
}

// Refresh access token
export async function refreshAccessToken(refreshToken: string): Promise<GoogleTokens> {
  console.log('🔄 Refreshing access token...');
  
  const response = await fetch(GOOGLE_OAUTH_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: GOOGLE_OAUTH_CONFIG.clientId,
      client_secret: GOOGLE_OAUTH_CONFIG.clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  console.log('🔄 Token refresh response status:', response.status);

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Token refresh failed:', error);
    throw new Error(`Token refresh failed: ${error}`);
  }

  const tokens = await response.json();
  console.log('✅ Token refresh successful:', {
    hasAccessToken: !!tokens.access_token,
    expiresIn: tokens.expires_in
  });

  return tokens;
}

// Get user info from Google
export async function getUserInfo(accessToken: string): Promise<GoogleUser> {
  console.log('👤 Fetching user info from Google...');
  
  const response = await fetch(GOOGLE_OAUTH_CONFIG.userInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log('👤 User info response status:', response.status);

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Failed to fetch user info:', error);
    throw new Error('Failed to fetch user info');
  }

  const user = await response.json();
  console.log('✅ User info fetched successfully:', {
    id: user.id,
    email: user.email,
    name: user.name,
    verified: user.verified_email
  });

  return user;
}

// Validate if token is expired
export function isTokenExpired(expiresAt: number): boolean {
  const expired = Date.now() >= expiresAt;
  console.log('⏰ Token expiration check:', {
    expiresAt: new Date(expiresAt).toISOString(),
    now: new Date().toISOString(),
    expired
  });
  return expired;
}

// Create session data
export function createSessionData(
  user: GoogleUser,
  tokens: GoogleTokens,
  userProfileId?: string,
  expiresIn: number = tokens.expires_in
): SessionData {
  const sessionData = {
    user,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: Date.now() + expiresIn * 1000,
    user_profile_id: userProfileId,
  };
  
  console.log('📦 Created session data:', {
    userId: user.id,
    userEmail: user.email,
    userProfileId: userProfileId,
    hasAccessToken: !!sessionData.access_token,
    hasRefreshToken: !!sessionData.refresh_token,
    expiresAt: new Date(sessionData.expires_at).toISOString()
  });
  
  return sessionData;
} 