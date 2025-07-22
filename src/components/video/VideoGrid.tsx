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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onTopicClick={onTopicClick}
        />
      ))}
    </div>
  )
}