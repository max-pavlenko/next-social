/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['lh3.googleusercontent.com', 'i.stack.imgur.com', 'cdn-icons-png.flaticon.com', 'firebasestorage.googleapis.com', 'upload.wikimedia.org']
  },
  i18n: {
    locales: ['en', 'ua', 'ru'],
    defaultLocale: 'en'
  }
}

module.exports = nextConfig
