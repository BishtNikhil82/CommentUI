'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronUp, ExternalLink, ThumbsUp, ThumbsDown, Lightbulb } from 'lucide-react'
import { FaYoutube } from 'react-icons/fa'
import { VideoData } from '@/types'
import { formatViewCount, formatUploadDate, truncateText } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer'

interface VideoCardProps {
  video: VideoData
  onTopicClick: (topic: string) => void
}

export function VideoCard({ video, onTopicClick }: VideoCardProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setDrawerOpen(true)
    }
  }

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <div
        ref={cardRef}
        className={
          'bg-white/5 backdrop-blur-md rounded-xl border overflow-hidden transition-all duration-300 border-white/10 hover:border-white/20 hover:shadow-lg'
        }
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
            {/* Show Analytics button */}
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3 flex items-center justify-center text-purple-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/30 rounded-lg transition-all duration-200"
                onClick={() => setDrawerOpen(true)}
              >
                <ChevronDown className="w-4 h-4 mr-1.5 text-purple-400" />
                Show Analytics
              </Button>
            </DrawerTrigger>
          </div>
        </div>
      </div>
      {/* Drawer for analytics */}
      <DrawerContent className="max-w-lg w-full right-0 left-auto ml-auto rounded-t-2xl md:rounded-l-2xl md:rounded-t-none md:fixed md:inset-y-0 md:right-0 md:w-[400px] bg-white/10 border border-white/20 shadow-2xl">
        <DrawerHeader>
          <DrawerTitle className="text-white">Video Analytics</DrawerTitle>
          <div className="mt-2 flex items-center text-red-400 text-sm font-semibold truncate">
            <FaYoutube className="w-4 h-4 mr-1" />
            <span>{video.channelName}</span>
          </div>
          <div className="text-white text-lg font-extrabold mb-2 truncate">{video.title}</div>
          <DrawerClose asChild>
            <Button variant="ghost" size="sm" className="absolute top-4 right-4 text-white/70 hover:text-white">Close</Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="p-4 space-y-4 overflow-y-auto max-h-[70vh]">
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
                Next Big Spark
              </h4>
              <ul className="space-y-1">
                {video.nextTopicIdeas.map((topic, index) => (
                  <li key={index} className="flex items-start text-sm text-blue-200">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    {topic}
                  </li>
                ))}
              </ul>
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
      </DrawerContent>
    </Drawer>
  )
}