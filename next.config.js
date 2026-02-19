/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GROWTHLAB_API_URL: process.env.GROWTHLAB_API_URL || 'http://localhost:3001',
    GROWTHLAB_API_KEY: process.env.GROWTHLAB_API_KEY || '',
  },
  async rewrites() {
    return [
      {
        source: '/api/startup-resources/:path*',
        destination: '/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig

