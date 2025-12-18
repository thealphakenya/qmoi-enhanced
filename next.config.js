import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Allow builds to proceed even when ESLint reports issues during CI/build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Removed 'output: export' to allow server-side rendering in dev mode
  trailingSlash: false,
  images: {
    unoptimized: true,
  },

  // Ensure path aliases resolve during Next/webpack builds (fixes Docker CI resolution issues)
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname),
      "@/components": path.resolve(__dirname, "src/components"),
      "@/app": path.resolve(__dirname, "app"),
      "@/services": path.resolve(__dirname, "src/services"),
      "@/hooks": path.resolve(__dirname, "src/hooks"),
      "@/lib": path.resolve(__dirname, "lib"),
    };
    return config;
  },
};

export default nextConfig;
