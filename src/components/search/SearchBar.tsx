'use client'

import { useState, FormEvent } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface SearchBarProps {
  onSearch: (query: string) => void
  loading?: boolean
  placeholder?: string
}

export function SearchBar({ 
  onSearch, 
  loading = false, 
  placeholder = "Search for YouTube topic analysis..." 
}: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim() && !loading) {
      onSearch(query.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <div className="relative flex-1">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 text-lg border-2 border-gray-300 rounded-l-full focus:border-red-500 focus:ring-0"
            disabled={loading}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        <Button
          type="submit"
          disabled={!query.trim() || loading}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-r-full border-2 border-red-600 hover:border-red-700 min-w-[100px]"
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            'Search'
          )}
        </Button>
      </div>
    </form>
  )
}