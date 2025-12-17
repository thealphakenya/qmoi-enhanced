/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // helps catch issues in dev
  swcMinify: true, // uses faster SWC compiler
  images: {
    domains: ["placeholder.svg"],
    unoptimized: true, // disables automatic Image Optimization (required for Electron)
  },
  experimental: {
    serverActions: true, // if you're using server actions
  },
  output: "standalone", // for Docker, Electron, or custom deployment
  eslint: {
    ignoreDuringBuilds: true, // avoids failing builds due to ESLint errors
  },
  typescript: {
    ignoreBuildErrors: false, // set to true only if you're knowingly ignoring TS issues
  },
};

export default nextConfig;
