'use client'

import { FaYoutube } from 'react-icons/fa'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useState } from 'react'
import { motion } from 'framer-motion'

export function SetupWarningButton() {
  const [loading, setLoading] = useState(false)
  
  const handleGoogleSignIn = async () => {
    console.log('Button clicked')
    setLoading(true)
    try {
      // Redirect to the login route which will handle Google OAuth
      window.location.href = '/auth/login'
    } catch (error: any) {
      alert(error.message || 'Google sign-in failed')
      setLoading(false)
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 py-4 px-8 text-lg font-semibold text-white shadow-lg transition-all duration-300 ease-in-out border border-white/10 hover:shadow-red-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
      onClick={handleGoogleSignIn}
      disabled={loading}
    >
      <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      {loading ? (
        <div className="flex items-center space-x-2">
          <LoadingSpinner className="mr-2" />
          <span className="relative">Connecting...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <FaYoutube className="text-white h-5 w-5" />
          <span className="relative">Continue with Google</span>
        </div>
      )}
    </motion.button>
  )
}