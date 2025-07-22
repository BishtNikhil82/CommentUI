'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { signInWithGoogle } from '@/lib/auth'
import { toast } from 'sonner'

export function LoginForm() {
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      await signInWithGoogle()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

   return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-blue-100 flex items-center justify-center px-6 py-12">
      <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-lg p-10 space-y-6 border border-gray-200">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            YouTube Analytics.............
          </h2>
          <p className="text-gray-600 text-base">
            Gain insights from your favorite YouTube channels with ease.
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="group relative flex items-center justify-center gap-3 w-full py-3 px-4 bg-red-600 hover:bg-red-500 text-white text-base font-semibold rounded-xl shadow-md transition duration-300 ease-in-out"
          >
            {loading ? (
              <LoadingSpinner size="sm" className="border-t-white" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            {loading ? "Signing in..." : "Continue with Google"}
          </Button>
        </div>

        <div className="text-center text-xs text-gray-400 pt-4">
          By continuing, you agree to our{" "}
          <a href="#" className="underline hover:text-gray-600">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-gray-600">
            Privacy Policy
          </a>.
        </div>
      </div>
    </div>
  )
}