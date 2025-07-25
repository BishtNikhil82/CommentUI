import { supabase } from '@/lib/client'
//import { createSupabaseServerClient } from '@/lib/server'
import { User } from '@/types'

export async function signInWithGoogle() {
  console.error('Nikihl Sign in Oauth with supabase:' )
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      scopes: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl',
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        prompt: 'consent',
        access_type: 'offline', // also required for refresh_token
      },
    },
  })

  if (error) {
    console.log('Nikihl Sign-in error:', error)
    throw new Error(error.message)
  }

  return data
}

export async function signOut() {
  console.log('signOut called from src/lib/auth.ts')
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(error.message)
  }
}

export async function getProviderToken(): Promise<string | null> {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    return null;
  }

  return session.provider_token;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  return user as User
}

export async function refreshYouTubeToken(refreshToken: string) {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
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