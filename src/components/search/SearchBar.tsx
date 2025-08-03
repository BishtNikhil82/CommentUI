'use client'

import { useState, FormEvent, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface SearchBarProps {
  onSearch: (query: string, region?: string) => void
  loading?: boolean
  placeholder?: string
}

console.log('SEARCHBAR: file loaded');

export function SearchBar({ 
  onSearch, 
  loading = false, 
  placeholder = "Search for YouTube topic analysis..." 
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('IN')
  const [regions, setRegions] = useState<Array<{code: string, name: string}>>([])
  const [loadingRegions, setLoadingRegions] = useState(false)
  console.log('SEARCHBAR: render', { query, loading, selectedRegion });

  // Fetch regions on component mount
  useEffect(() => {
    const fetchRegions = async () => {
      setLoadingRegions(true)
      try {
        const response = await fetch('/api/regions', {
          credentials: 'include',
        })
        if (response.ok) {
          const data = await response.json()
          setRegions(data.regions || [])
        } else {
          console.error('Failed to fetch regions')
        }
      } catch (error) {
        console.error('Error fetching regions:', error)
      } finally {
        setLoadingRegions(false)
      }
    }

    fetchRegions()
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log('SEARCHBAR: handleSubmit', { query, loading, selectedRegion });
    if (query.trim() && !loading) {
      onSearch(query.trim(), selectedRegion)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto space-y-4">
      <div className="flex items-center overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-purple-400/30 transition-all duration-300 focus-within:border-purple-400/50 focus-within:ring-2 focus-within:ring-purple-400/20">
        <div className="relative flex-1">
          <Input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              console.log('SEARCHBAR: onChange', e.target.value);
            }}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 text-lg border-0 rounded-none focus:ring-0 focus:outline-none bg-transparent text-white placeholder:text-purple-200/60"
            disabled={loading}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
        </div>
        <Button
          type="submit"
          disabled={!query.trim() || loading}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-none border-0 min-w-[100px] h-[52px] flex items-center justify-center transition-all duration-300 shadow-lg"
        >
          {loading ? (
            <LoadingSpinner size="sm" className="border-t-white" />
          ) : (
            'Search'
          )}
        </Button>
      </div>
      
      {/* Region Selector */}
      <div className="flex items-center space-x-3">
        <label className="text-sm text-gray-300 font-medium">Region:</label>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          disabled={loadingRegions || loading}
          className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300 disabled:opacity-50"
        >
          {loadingRegions ? (
            <option value="">Loading regions...</option>
          ) : (
            regions.map((region) => (
              <option key={region.code} value={region.code} className="bg-gray-800 text-white">
                {region.name}
              </option>
            ))
          )}
        </select>
        {loadingRegions && (
          <LoadingSpinner size="sm" className="border-t-purple-400" />
        )}
      </div>
    </form>
  )
}