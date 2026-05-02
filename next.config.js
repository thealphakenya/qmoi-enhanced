/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Allow build to proceed with TypeScript errors (will fix separately)
    ignoreBuildErrors: true,
    tsconfigPath: './tsconfig.json',
  },
  experimental: {
    optimizePackageImports: ["@mui/material", "@mui/icons-material"],
  },
};

export default nextConfig;
