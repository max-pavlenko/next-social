/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['lh3.googleusercontent.com', 'cdn.pixabay.com', 'cdn-icons-png.flaticon.com', 'firebasestorage.googleapis.com', 'upload.wikimedia.org']
  },
  i18n: {
    locales: ['en', 'ua', 'ru'],
    defaultLocale: 'en'
  },
  experimental: {
    fontLoaders: [
      { loader: '@next/font/google', options: { subsets: ['latin'] } }
    ]
  }
}

module.exports = nextConfig
