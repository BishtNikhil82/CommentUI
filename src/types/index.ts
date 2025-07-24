export interface User {
  id: string;
  email: string;
  user_metadata: {
    avatar_url?: string;
    full_name?: string;
    provider_token?: string;
    provider_refresh_token?: string;
  };
}

export interface VideoData {
  id: string;
  title: string;
  channelName: string;
  thumbnail: string;
  pros?: string[];
  cons?: string[];
  nextTopicIdeas?: string[];
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
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface SearchState {
  query: string;
  loading: boolean;
  videos: VideoData[];
  error: string | null;
  totalFound: number;
  isComplete: boolean;
}