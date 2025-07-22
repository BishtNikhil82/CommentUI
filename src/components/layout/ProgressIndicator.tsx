'use client'

import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface ProgressIndicatorProps {
  message: string
  count?: number
}

export function ProgressIndicator({ message, count }: ProgressIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <LoadingSpinner size="lg" className="mb-4" />
      <p className="text-lg font-medium text-gray-700 mb-2">{message}</p>
      {count !== undefined && (
        <p className="text-sm text-gray-500">
          Found {count} video{count !== 1 ? 's' : ''} so far...
        </p>
      )}
    </div>
  )
}