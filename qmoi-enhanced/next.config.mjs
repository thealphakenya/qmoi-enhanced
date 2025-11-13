/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  output: 'standalone',
  images: {
    // production-ready remote hosts commonly used by QMOI assets.
    // Add or remove domains as appropriate for your CDN/asset hosts.
    domains: ['cdn.qmoi.ai', 'assets.qmoi.ai', 'images.qmoi.ai', 'localhost'],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.qmoi.ai', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net', pathname: '/**' }
    ],
    unoptimized: false
  },
  experimental: {
    serverActions: true
  },
  eslint: {
    // Fail builds on lint errors in CI to enforce production quality
    ignoreDuringBuilds: false
  },
  typescript: {
    // Keep strictness; do not ignore type errors for production builds
    ignoreBuildErrors: false
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes for improved security
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), camera=(), microphone=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }
        ]
      }
    ]
  }
}

export default nextConfig
