'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Header } from '@/components/layout/Header'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchHistory } from '@/components/search/SearchHistory'
import { VideoGrid } from '@/components/video/VideoGrid'
import { ProgressIndicator } from '@/components/layout/ProgressIndicator'
import { LoginForm } from '@/components/auth/LoginForm'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { VideoData, StreamingChunk } from '@/types'
import { toast } from 'sonner'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [searchState, setSearchState] = useState({
    query: '',
    loading: false,
    videos: [] as VideoData[],
    error: null as string | null,
    totalFound: 0,
    isComplete: false,
  })

  const handleSearch = useCallback(async (query: string) => {
    if (!user) {
      toast.error('Please sign in to search')
      return
    }

    setSearchState(prev => ({
      ...prev,
      query,
      loading: true,
      videos: [],
      error: null,
      totalFound: 0,
      isComplete: false,
    }))

    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch analytics')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data: StreamingChunk = JSON.parse(line.slice(6))
                
                switch (data.type) {
                  case 'video':
                    const videoData = data.data as VideoData
                    setSearchState(prev => ({
                      ...prev,
                      videos: [...prev.videos, videoData],
                      totalFound: prev.totalFound + 1,
                    }))
                    break
                    
                  case 'progress':
                    const progressData = data.data as { message: string; count?: number }
                    if (progressData.count !== undefined) {
                      setSearchState(prev => ({
                        ...prev,
                        totalFound: progressData.count!,
                      }))
                    }
                    break
                    
                  case 'complete':
                    setSearchState(prev => ({
                      ...prev,
                      loading: false,
                      isComplete: true,
                    }))
                    break
                    
                  case 'error':
                    const errorData = data.data as { error: string }
                    throw new Error(errorData.error)
                }
              } catch (parseError) {
                console.error('Error parsing SSE data:', parseError)
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }
    } catch (error) {
      console.error('Search error:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      
      setSearchState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      
      toast.error(errorMessage)
    }
  }, [user])

  const handleTopicClick = useCallback((topic: string) => {
    handleSearch(topic)
  }, [handleSearch])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Discover YouTube Content Insights
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Search for any topic and get detailed analysis of relevant YouTube videos
          </p>
          
          <SearchBar
            onSearch={handleSearch}
            loading={searchState.loading}
          />
          
          <SearchHistory onSearch={handleSearch} />
        </div>

        {/* Loading state */}
        {searchState.loading && (
          <ProgressIndicator
            message="Analyzing videos..."
            count={searchState.totalFound}
          />
        )}

        {/* Error state */}
        {searchState.error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Search Error
              </h3>
              <p className="text-red-600 mb-4">{searchState.error}</p>
              <button
                onClick={() => handleSearch(searchState.query)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {searchState.videos.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Analysis Results for "{searchState.query}"
              </h3>
              <span className="text-sm text-gray-500">
                {searchState.totalFound} video{searchState.totalFound !== 1 ? 's' : ''} found
                {!searchState.isComplete && ' (loading more...)'}
              </span>
            </div>
            
            <VideoGrid
              videos={searchState.videos}
              onTopicClick={handleTopicClick}
            />
          </div>
        )}

        {/* Empty state */}
        {!searchState.loading && searchState.videos.length === 0 && !searchState.error && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to analyze YouTube content?
              </h3>
              <p className="text-gray-600">
                Enter a topic above to discover insights from relevant YouTube videos.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}