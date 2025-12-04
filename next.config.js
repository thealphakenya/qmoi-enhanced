/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Allow builds to proceed even when ESLint reports issues during CI/build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Removed 'output: export' to allow server-side rendering in dev mode
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
