const withPWA = require('next-pwa')({
    dest: 'public',
    // disable: process.env.NODE_ENV === 'development',
    register: true,
});

module.exports = withPWA({
    reactStrictMode: false,
    swcMinify: true,
    typescript: {
        ignoreBuildErrors: true,
    },
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
});
