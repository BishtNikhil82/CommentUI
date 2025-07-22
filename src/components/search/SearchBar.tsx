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
      <div className="flex items-center shadow-lg rounded-full overflow-hidden">
        <div className="relative flex-1">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 text-lg border-0 rounded-none focus:ring-0 focus:outline-none bg-white"
            disabled={loading}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        <Button
          type="submit"
          disabled={!query.trim() || loading}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-none border-0 min-w-[100px] h-[52px] flex items-center justify-center"
        >
          {loading ? (
            <LoadingSpinner size="sm" className="text-white" />
          ) : (
            'Search'
          )}
        </Button>
      </div>
    </form>
  )
}