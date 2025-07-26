export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  verified_email: boolean;
}

export interface VideoData {
  id: string;
  title: string;
  channelName: string;
  thumbnail: string;
  pros?: string[];
  cons?: string[];
  nextTopicIdeas?: string[];
  duration?: string;
  viewCount?: string;
  uploadDate?: string;
}

export interface AnalyticsResponse {
  videos: VideoData[];
  totalFound: number;
  isComplete: boolean;
}

export interface StreamingChunk {
  type: 'video' | 'progress' | 'complete' | 'error';
  data: VideoData | { message: string; count?: number } | { error: string };
}

export interface AuthState {
  user: GoogleUser | null;
  loading: boolean;
}

export interface SearchState {
  query: string;
  loading: boolean;
  videos: VideoData[];
  error: string | null;
  totalFound: number;
  isComplete: boolean;
}