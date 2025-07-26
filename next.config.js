/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'via.placeholder.com',
      'i.ytimg.com',
      'img.youtube.com',
      'lh3.googleusercontent.com',
      'yt3.ggpht.com',
      'example.com', 
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app', '*.vercel.com'],
    },
  },
}

module.exports = nextConfig