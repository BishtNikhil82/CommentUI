// Google OAuth utility functions
// Note: Most authentication is now handled by the Google OAuth flow in /auth/* routes

export async function refreshYouTubeToken(refreshToken: string): Promise<string> {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to refresh token')
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('Error refreshing YouTube token:', error)
    throw error
  }
}

// Note: The following functions have been replaced by Google OAuth:
// - signInWithGoogle() -> Now handled by /auth/login route
// - signOut() -> Now handled by /auth/logout route  
// - getProviderToken() -> Now handled by session management
// - getCurrentUser() -> Now handled by /api/auth/me route