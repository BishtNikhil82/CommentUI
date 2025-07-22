'use client'

import { signInWithGoogle } from '@/lib/auth'
import { FaYoutube } from 'react-icons/fa'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useState } from 'react'

export function SetupWarningButton() {
  const [loading, setLoading] = useState(false)
  
  const handleGoogleSignIn = async () => {
    console.log('Button clicked')
    setLoading(true)
    try {
      await signInWithGoogle()
      // Supabase will handle redirect, so no further action needed here
    } catch (error: any) {
      alert(error.message || 'Google sign-in failed')
      setLoading(false)
    }
  }

  return (
    <button
      className="group relative flex w-full justify-center items-center rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 py-3 px-4 text-base font-semibold text-white shadow-lg transition-all duration-300 ease-in-out border border-white/10 hover:shadow-red-500/30 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
      onClick={handleGoogleSignIn}
      disabled={loading}
    >
      <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      {loading ? (
        <LoadingSpinner className="mr-2" />
      ) : (
        <div className="flex items-center justify-center mr-2">
          <FaYoutube className="text-white h-5 w-5" />
        </div>
      )}
      <span className="relative">{loading ? 'Connecting...' : 'Continue with Google'}</span>
    </button>
  )
}