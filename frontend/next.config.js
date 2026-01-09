/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'vetconnect.b-cdn.net'],
  },
  i18n: {
    locales: ['en', 'es', 'de', 'fr', 'it', 'pt', 'nl', 'ca'],
    defaultLocale: 'en',
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  },
}

module.exports = nextConfig
