/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Removed 'output: export' to allow server-side rendering in dev mode
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
