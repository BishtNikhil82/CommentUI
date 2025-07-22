/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'i.ytimg.com',
      'img.youtube.com',
      'lh3.googleusercontent.com',
      'yt3.ggpht.com',
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
}

module.exports = nextConfig