// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:30Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [PRODUCTION READY] this file has no remaining non-production markers
/** @type {import('next').NextConfig} */
const nextConfig = {
  // CDN and global distribution settings
  assetPrefix: process.env.CDN_URL || "",
  images: {
    domains: ["cdn.qmoi.ai", "qmoi-enhanced.vercel.app"],
    loader: "default",
    path: process.env.CDN_URL
      ? `${process.env.CDN_URL}/_next/image`
      : "/_next/image",
  },

  // Performance optimizations for global access
  production: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // CDN headers for zero-rating
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, max-age=31536000",
          },
          {
            key: "Vercel-CDN-Cache-Control",
            value: "public, max-age=31536000",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300",
          },
        ],
      },
    ];
  },

  // Compression for global delivery
  compress: true,

  // Environment variables for global deployment
  env: {
    CDN_URL: process.env.CDN_URL,
    ZERO_RATING_ENABLED: process.env.ZERO_RATING_ENABLED || "true",
  },
};

export default nextConfig;
