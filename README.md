# YouTube Analytics Interface

A modern, production-ready YouTube search analytics interface built with Next.js 14, TypeScript, TailwindCSS, and Supabase authentication.

## Features

- 🔐 **Secure Authentication**: Google OAuth2 with YouTube API access
- 🔍 **Real-time Search**: Progressive loading with streaming responses
- 📱 **Responsive Design**: Mobile-first approach with touch-friendly interactions
- 🎥 **Video Analysis**: Detailed pros/cons analysis with related topic suggestions
- 🚀 **Performance Optimized**: Image optimization, code splitting, and virtual scrolling
- 🎨 **Modern UI**: YouTube-inspired design with smooth animations

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Authentication**: Supabase Auth with Google OAuth2
- **Backend Integration**: Python FastAPI with streaming responses
- **UI Components**: Custom components with Radix UI patterns
- **Notifications**: Sonner for toast notifications

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Python Backend URL
PYTHON_BACKEND_URL=http://localhost:8000
```

### 2. Supabase Setup

1. Create a new Supabase project
2. Enable Google OAuth in Authentication > Providers
3. Add your domain to the allowed redirect URLs
4. Copy your project URL and anon key to the environment variables

### 3. Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create OAuth2 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)
6. Copy the client ID and secret to your environment variables

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── api/               # API routes
│   ├── dashboard/         # Main dashboard
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── search/           # Search-related components
│   ├── video/            # Video display components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
└── middleware.ts         # Next.js middleware
```

## Key Features

### Authentication Flow

1. Users sign in with Google OAuth2
2. YouTube API access tokens are securely stored in Supabase
3. Protected routes redirect unauthenticated users to login
4. Automatic token refresh handling

### Search & Analytics

1. Real-time search with progressive loading
2. Streaming responses from Python FastAPI backend
3. Dynamic video card updates without page reload
4. Expandable cards with detailed analysis

### Responsive Design

- Mobile-first approach with Tailwind breakpoints
- Touch-friendly interactions (44px minimum touch targets)
- Optimized layouts for all screen sizes
- Smooth animations and transitions

### Performance Optimizations

- Next.js Image optimization for video thumbnails
- React.memo for video cards to prevent unnecessary re-renders
- Code splitting with dynamic imports
- Proper loading states and skeleton screens

## API Integration

The frontend communicates with a Python FastAPI backend through the `/api/analytics` route, which:

- Validates user authentication
- Forwards requests with YouTube tokens
- Handles streaming responses (Server-Sent Events)
- Implements proper error handling and timeouts

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in the Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.