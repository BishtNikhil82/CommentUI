'use client'

import { useState } from 'react'
import Image from 'next/image'
import { LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth'
import { User as UserType } from '@/types'
import { toast } from 'sonner'

interface HeaderProps {
  user: UserType
}

export function Header({ user }: HeaderProps) {
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    try {
      setLoading(true)
      await signOut()
      toast.success('Signed out successfully')
    } catch (error) {
      toast.error('Failed to sign out')
    } finally {
      setLoading(false)
    }
  }

  return (
    <header className="bg-gradient-to-r from-gray-900 via-purple-900 to-violet-800 border-b border-white/10 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              YouTube Analytics
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full py-1.5 px-3 border border-white/20">
              {user.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full ring-2 ring-purple-400/30"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-sm font-medium text-white hidden sm:block">
                {user.user_metadata?.full_name || user.email}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              disabled={loading}
              className="text-purple-200 hover:text-white hover:bg-white/10 rounded-full"
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