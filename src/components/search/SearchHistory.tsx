'use client'

import { useState, useEffect } from 'react'
import { Clock, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

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
    <div className="w-full max-w-2xl mx-auto mt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700 flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          Recent searches
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearHistory}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Clear all
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((query, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 text-sm transition-colors"
          >
            <button
              onClick={() => {
                onSearch(query)
                addToHistory(query)
              }}
              className="flex-1 text-left"
            >
              {query}
            </button>
            <button
              onClick={() => removeFromHistory(query)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}