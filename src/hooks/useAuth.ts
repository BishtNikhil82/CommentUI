'use client'

import { useState, useEffect } from 'react'
import { GoogleUser } from '@/lib/google-auth'

interface AuthState {
  user: GoogleUser | null
  loading: boolean
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<GoogleUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 useAuth: Checking authentication...');
      
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        })
        
        console.log('🔍 useAuth: Response status:', response.status);
        
        if (response.ok) {
          const userData = await response.json()
          console.log('✅ useAuth: User authenticated:', {
            id: userData.user.id,
            email: userData.user.email,
            name: userData.user.name
          });
          setUser(userData.user)
        } else {
          console.log('❌ useAuth: Not authenticated');
          setUser(null)
        }
      } catch (err) {
        console.error('❌ useAuth: Error checking auth:', err)
        setUser(null)
      } finally {
        setLoading(false)
        console.log('🔍 useAuth: Auth check complete, loading:', false);
      }
    }

    checkAuth()
  }, [])

  return { user, loading }
}