'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronUp, ExternalLink, ThumbsUp, ThumbsDown, Lightbulb } from 'lucide-react'
import { VideoData } from '@/types'
import { formatViewCount, formatUploadDate, truncateText } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface VideoCardProps {
  video: VideoData
  onTopicClick: (topic: string) => void
}

export function VideoCard({ video, onTopicClick }: VideoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <div
      ref={cardRef}
      className={`bg-white/5 backdrop-blur-md rounded-xl border overflow-hidden transition-all duration-300 ${
        isExpanded ? 'border-purple-400/50 shadow-lg shadow-purple-500/10' : 'border-white/10 hover:border-white/20 hover:shadow-lg'
      }`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Thumbnail and basic info */}
      <div className="relative">
        <div className="aspect-video relative">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/10">
            {video.duration}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-white mb-2 line-clamp-2">
            {truncateText(video.title, 80)}
          </h3>
          
          <div className="flex items-center text-sm text-purple-200 mb-2">
            <span className="font-medium">{video.channelName}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-300">
            <span className="bg-white/10 px-2 py-0.5 rounded-full">{formatViewCount(video.viewCount)}</span>
            <span className="bg-white/10 px-2 py-0.5 rounded-full">{formatUploadDate(video.uploadDate)}</span>
          </div>
          
          {/* Expand/Collapse button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mt-3 flex items-center justify-center text-purple-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/30 rounded-lg transition-all duration-200"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1.5 text-purple-400" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1.5 text-purple-400" />
                Show analysis
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-white/10 p-4 space-y-4 animate-in slide-in-from-top-2 duration-300 bg-white/5">
          {/* Pros */}
          {video.pros && video.pros.length > 0 && (
            <div>
              <h4 className="flex items-center font-semibold text-green-400 mb-2">
                <ThumbsUp className="w-4 h-4 mr-2" />
                Pros
              </h4>
              <ul className="space-y-1">
                {video.pros.map((pro, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-200">
                    <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cons */}
          {video.cons && video.cons.length > 0 && (
            <div>
              <h4 className="flex items-center font-semibold text-red-400 mb-2">
                <ThumbsDown className="w-4 h-4 mr-2" />
                Cons
              </h4>
              <ul className="space-y-1">
                {video.cons.map((con, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-200">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next topic ideas */}
          {video.nextTopicIdeas && video.nextTopicIdeas.length > 0 && (
            <div>
              <h4 className="flex items-center font-semibold text-blue-400 mb-2">
                <Lightbulb className="w-4 h-4 mr-2" />
                Related Topics
              </h4>
              <div className="flex flex-wrap gap-2">
                {video.nextTopicIdeas.map((topic, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => onTopicClick(topic)}
                    className="text-xs bg-white/10 border-white/20 text-blue-300 hover:bg-white/15 hover:border-blue-400/30 transition-all duration-200"
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* External link */}
          <div className="pt-2 border-t border-white/10">
            <a
              href={`https://youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-1.5" />
              Watch on YouTube
            </a>
          </div>
        </div>
      )}
    </div>
  )
}