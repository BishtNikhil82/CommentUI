'use client'

import { VideoData } from '@/types'
import { VideoCard } from './VideoCard'

interface VideoGridProps {
  videos: VideoData[]
  onTopicClick: (topic: string) => void
}

export function VideoGrid({ videos, onTopicClick }: VideoGridProps) {
  if (videos.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {videos.map((video) => (
        <div key={video.id} className="transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
          <VideoCard
            video={video}
            onTopicClick={onTopicClick}
          />
        </div>
      ))}
    </div>
  )
}