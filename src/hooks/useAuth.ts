'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/client'
import { User, AuthState } from '@/types'

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get authenticated user securely
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        console.log('useAuth: getUser', { user, error })
        if (error) throw error
        setUser(user as User || null)
        console.log('useAuth: setUser (getUser)', user)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication error')
        setUser(null)
        console.log('useAuth: setUser (getUser error)', null)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [])

  return { user, loading, error }
}