'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Header } from '@/components/layout/Header'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchHistory } from '@/components/search/SearchHistory'
import { VideoGrid } from '@/components/video/VideoGrid'
import { ProgressIndicator } from '@/components/layout/ProgressIndicator'
import { LoginForm } from '@/components/auth/LoginForm'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { VideoData, StreamingChunk, GoogleUser } from '@/types'
import { toast } from 'sonner'
import { supabase } from '@/lib/client'
import { Alert } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import { Search, TrendingUp, BarChart3, Sparkles, MessageSquare, Brain, Target, Activity, Heart, Users, Zap, Play, Star, ArrowRight, CheckCircle } from 'lucide-react'

console.log('DASHBOARD: file loaded');

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
  console.log('DASHBOARD: render', { user, authLoading, searchState });
  // Keep track of the current Supabase channel subscription
  const subscriptionRef = useRef<any>(null)
  const jobIdRef = useRef<string | null>(null)

  // Helper to map job_results row to VideoData
  function mapJobResultToVideoData(row: any): VideoData {
    const normalizeToArray = (value: any): string[] => {
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') {
        return value.trim().startsWith('[')
          ? safeParseArray(value) // try parsing as JSON array
          : [value]; // just a plain string
      }
      return [];
    };

    const safeParseArray = (value: string): string[] => {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        return [value]; // fallback: wrap raw string
      }
    };

    return {
      id: row.video_id,
      title: row.video_title,
      channelName: row.channel_title,
      thumbnail: row.thumbnail_url,
      pros: normalizeToArray(row.pros),
      cons: normalizeToArray(row.cons),
      nextTopicIdeas:normalizeToArray(row.summary),
      duration: row.duration,
      viewCount: row.view_count,
      uploadDate: row.upload_date,
    };
  }

  // Clean up subscription on unmount or new search
  useEffect(() => {
    console.log('DASHBOARD: useEffect cleanup');
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
        subscriptionRef.current = null
      }
    }
  }, [])

  const handleSearch = useCallback(async (query: string) => {
    console.log('DASHBOARD: handleSearch called', { query, user });
    const isMock = process.env.NEXT_PUBLIC_MOCK_UI === 'true'
    if (isMock) {
      setSearchState(prev => ({
        ...prev,
        query,
        loading: true,
        videos: [],
        error: null,
        totalFound: 0,
        isComplete: false,
      }))
      setTimeout(() => {
        setSearchState(prev => ({
          ...prev,
          videos: [
            {
              id: '1',
              title: 'Mock Video',
              channelName: 'Mock Channel',
              thumbnail: 'https://via.placeholder.com/320x180',
              viewCount: '1000',
              uploadDate: '2024-01-01',
              duration: '10:00',
              description: 'This is a mock video.',
              pros: ['Good', 'Informative'],
              cons: ['Long'],
              nextTopicIdeas: ['Next Topic'],
            },
            {
              id: '2',
              title: 'Another Mock Video',
              channelName: 'Demo Channel',
              thumbnail: 'https://via.placeholder.com/320x180?text=Demo',
              viewCount: '500',
              uploadDate: '2024-02-01',
              duration: '5:00',
              description: 'Second mock video.',
              pros: ['Short'],
              cons: ['Not detailed'],
              nextTopicIdeas: ['Demo Topic'],
            },
          ],
          totalFound: 2,
          loading: false,
          isComplete: true,
        }))
      }, 1000)
      return
    }

    if (!user) {
      toast.error('Please sign in to search')
      return
    }

    // Clean up previous subscription if any
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe()
      subscriptionRef.current = null
    }
    jobIdRef.current = null

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
        credentials: 'include',
        body: JSON.stringify({ query }),
      })
      console.log('DASHBOARD: /api/analytics response', response.status);

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch analytics')
      }

      const { job_id } = await response.json()
      if (!job_id) throw new Error('No job_id returned from API')
      jobIdRef.current = job_id

      // Subscribe to job_results for this job_id
      const channel = supabase
        .channel('job_results_' + job_id)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'job_results',
            filter: `job_id=eq.${job_id}`,
          },
          (payload: any) => {
            const row = payload.new
            setSearchState(prev => {
              // Avoid duplicates
              if (prev.videos.some(v => v.id === row.video_id)) return prev
              return {
                ...prev,
                videos: [...prev.videos, mapJobResultToVideoData(row)],
                totalFound: prev.totalFound + 1,
              }
            })
          }
        )
        .subscribe((status: any) => {
          if (status === 'SUBSCRIBED') {
            // Optionally, you could fetch any already-inserted rows here
          }
        })
      subscriptionRef.current = channel

      // Optionally, poll for job completion (or listen to jobs table for status)
      // For now, mark as complete after some time or when enough results
      // You can enhance this with another subscription if needed
    } catch (error) {
      console.error('DASHBOARD: Search error', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setSearchState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      toast.error(errorMessage)
    }
  }, [user])

  // Optionally, mark loading false when results arrive (or after a timeout)
  useEffect(() => {
    if (searchState.loading && searchState.videos.length > 0) {
      setSearchState(prev => ({ ...prev, loading: false, isComplete: true }))
    }
  }, [searchState.loading, searchState.videos.length])

  const handleTopicClick = useCallback((topic: string) => {
    handleSearch(topic)
  }, [handleSearch])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-white mt-4">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  console.log('DASHBOARD: return render', { user, authLoading, searchState });
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-blue-950 relative overflow-hidden">
      {/* Animated Sparkles Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.6, 0.1],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <Header user={user} />
      
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-blue-500/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300 font-medium">AI-Powered Comment Analytics</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">YouTube</span> Content Insights
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8"
          >
            Search for any topic and get detailed analysis of relevant YouTube videos with AI-powered insights
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-3xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-blue-500/20 shadow-xl"
          >
            <SearchBar
              onSearch={handleSearch}
              loading={searchState.loading}
            />
            
            <div className="mt-6">
              <SearchHistory onSearch={handleSearch} />
            </div>
          </motion.div>
        </motion.div>

        {/* Loading state */}
        {searchState.loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <ProgressIndicator
              message="Analyzing videos..."
              count={searchState.totalFound}
            />
          </motion.div>
        )}

        {/* Error state */}
        {searchState.error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="bg-white/5 backdrop-blur-md border border-red-500/30 rounded-xl p-8 max-w-md mx-auto shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Search Error
              </h3>
              <p className="text-red-300 mb-6">{searchState.error}</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSearch(searchState.query)}
                className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-xl hover:from-red-500 hover:to-red-400 transition-all duration-300 shadow-lg"
              >
                Try Again
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {searchState.videos.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 mt-12"
          >
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between border border-blue-500/20 shadow-lg">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Analysis Results for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{searchState.query}</span>
                  </h3>
                  <p className="text-gray-400 text-sm">AI-powered insights and recommendations</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 rounded-full px-4 py-2 text-purple-200 border border-blue-500/20">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">
                  {searchState.totalFound} video{searchState.totalFound !== 1 ? 's' : ''}
                </span>
                {!searchState.isComplete && (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span className="text-sm">loading more...</span>
                  </div>
                )}
              </div>
            </div>
            
            <VideoGrid
              videos={searchState.videos}
              onTopicClick={handleTopicClick}
            />
          </motion.div>
        )}

        {/* Empty state */}
        {!searchState.loading && searchState.videos.length === 0 && !searchState.error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto bg-white/5 backdrop-blur-md rounded-xl p-8 border border-blue-500/20 shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Search className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Ready to analyze YouTube content?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Enter a topic above to discover insights from relevant YouTube videos and get AI-powered recommendations.
              </p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}