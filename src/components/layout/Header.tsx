'use client'

import { useState } from 'react'
import Image from 'next/image'
import { LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
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
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              YouTube Analytics
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {user.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user.user_metadata?.full_name || user.email}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              disabled={loading}
              className="text-gray-600 hover:text-gray-900"
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