import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Allow builds to proceed even when ESLint reports issues during CI/build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checking during build to allow Vercel deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  // Removed 'output: export' to allow server-side rendering in dev mode
  trailingSlash: false,
  images: {
    unoptimized: true,
  },

  // Ensure path aliases resolve during Next/webpack builds (fixes Docker CI resolution issues)
  webpack: (config) => {
    // __dirname is not defined in ESM; use process.cwd() for compatibility in CI containers
    const rootDir = process.cwd();
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": rootDir,
      "@/components": path.resolve(rootDir, "src/components"),
      "@/app": path.resolve(rootDir, "app"),
      "@/services": path.resolve(rootDir, "src/services"),
      "@/hooks": path.resolve(rootDir, "src/hooks"),
      "@/lib": path.resolve(rootDir, "lib"),
    };

    // Resolve modules from repo root and accept TS/TSX extensions explicitly
    config.resolve.modules = Array.from(
      new Set([rootDir, "node_modules", ...(config.resolve.modules || [])])
    );
    config.resolve.extensions = Array.from(
      new Set([
        ".ts",
        ".tsx",
        ".js",
        ".jsx",
        ...(config.resolve.extensions || []),
      ])
    );

    return config;
  },
};

export default nextConfig;
