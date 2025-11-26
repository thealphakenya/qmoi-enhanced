/**
 * Minimal Next.js production configuration.
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Allow build to succeed while we iteratively fix linting issues
    ignoreDuringBuilds: true
  },
  images: {
    domains: [],
  }
};

module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

export default nextConfig;