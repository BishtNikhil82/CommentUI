'use client'

import { useState, useEffect } from 'react'
import { Clock, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SearchHistoryProps {
  onSearch: (query: string) => void
}

export function SearchHistory({ onSearch }: SearchHistoryProps) {
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    const savedHistory = localStorage.getItem('youtube-search-history')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  const addToHistory = (query: string) => {
    const newHistory = [query, ...history.filter(h => h !== query)].slice(0, 5)
    setHistory(newHistory)
    localStorage.setItem('youtube-search-history', JSON.stringify(newHistory))
  }

  const removeFromHistory = (query: string) => {
    const newHistory = history.filter(h => h !== query)
    setHistory(newHistory)
    localStorage.setItem('youtube-search-history', JSON.stringify(newHistory))
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('youtube-search-history')
  }

  if (history.length === 0) return null

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-white flex items-center">
          <Clock className="w-4 h-4 mr-1.5 text-purple-400" />
          Recent searches
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearHistory}
          className="text-xs text-purple-300 hover:text-white hover:bg-white/10 rounded-full px-3 py-1"
        >
          Clear all
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((query, index) => (
          <div
            key={index}
            className="flex items-center bg-white/10 hover:bg-white/15 border border-white/10 hover:border-purple-400/30 rounded-full px-3 py-1.5 text-sm transition-all duration-200"
          >
            <button
              onClick={() => {
                onSearch(query)
                addToHistory(query)
              }}
              className="flex-1 text-left text-white"
            >
              {query}
            </button>
            <button
              onClick={() => removeFromHistory(query)}
              className="ml-2 text-purple-300 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}