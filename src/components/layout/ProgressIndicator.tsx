'use client'

import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface ProgressIndicatorProps {
  message: string
  count?: number
}

export function ProgressIndicator({ message, count }: ProgressIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10 shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
            <LoadingSpinner size="lg" className="border-t-purple-400" />
          </div>
          <p className="text-xl font-medium text-white mb-3">{message}</p>
          {count !== undefined && (
            <div className="bg-white/10 rounded-full px-4 py-1.5 text-purple-200 border border-white/20">
              Found <span className="font-semibold text-white">{count}</span> video{count !== 1 ? 's' : ''} so far...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}