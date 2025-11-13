/** @type {import('next').NextConfig} */
const IMAGE_DOMAINS = (process.env.NEXT_IMAGE_DOMAINS || 'cdn.qmoi.ai,assets.qmoi.ai,images.qmoi.ai,localhost').split(',').map(d=>d.trim()).filter(Boolean)

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  output: 'standalone', // supports Docker/Electron/custom server deployments
  images: {
    // Use environment-driven domains for flexibility across environments
    domains: IMAGE_DOMAINS,
    formats: ['image/avif','image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.qmoi.ai', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net', pathname: '/**' }
    ],
    unoptimized: false
  },
  experimental: {
    serverActions: true
  },
  // Enforce lint/type checks in CI to avoid shipping broken code
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
  // Add security and caching headers for production
  async headers() {
    return [
      {
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
  },
  // Example runtime rewrites/redirects useful for PWAs and legacy routes
  async rewrites() {
    return [
      { source: '/app/:path*', destination: '/' },
      { source: '/pwa/:path*', destination: '/_next/static/:path*' }
    ]
  },
  // Allow Next.js to be extended by environment-specific Webpack adjustments
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Avoid bundling server-only modules in the client bundle (example)
      config.resolve.fallback = { ...(config.resolve.fallback || {}), fs: false, child_process: false }
    }
    return config
  }
}

export default nextConfig
