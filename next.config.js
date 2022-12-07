module.exports = {
  reactStrictMode: false,
  swcMinify: true,
  ignoreBuildErrors: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['lh3.googleusercontent.com', 'cdn.pixabay.com', 'cdn-icons-png.flaticon.com', 'firebasestorage.googleapis.com', 'upload.wikimedia.org']
  },
  i18n: {
    locales: ['en', 'ua', 'ru'],
    defaultLocale: 'en'
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
