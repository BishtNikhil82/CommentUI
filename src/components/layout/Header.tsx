'use client'

import { useState } from 'react'
import Image from 'next/image'
import { LogOut, User, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GoogleUser } from '@/lib/google-auth'
import { toast } from 'sonner'

interface HeaderProps {
  user: GoogleUser
}

export function Header({ user }: HeaderProps) {
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    try {
      setLoading(true)
      // Redirect to logout route
      window.location.href = '/auth/logout'
    } catch (error) {
      toast.error('Failed to sign out')
    } finally {
      setLoading(false)
    }
  }

  return (
    <header className="bg-gradient-to-r from-gray-900/80 via-blue-950/80 to-gray-900/80 backdrop-blur-md border-b border-blue-500/20 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CommentAI
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-full py-1.5 px-3 border border-blue-500/20">
              {user?.picture ? (
                <Image
                  src={user.picture}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full ring-2 ring-blue-400/30"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-sm font-medium text-white hidden sm:block">
                {user?.name || user?.email}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              disabled={loading}
              className="text-blue-200 hover:text-white hover:bg-blue-500/10 rounded-full border border-blue-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span className="ml-1 hidden sm:block">Sign out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}