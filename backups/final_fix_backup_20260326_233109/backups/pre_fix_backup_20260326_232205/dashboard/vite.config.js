// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:07Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  publicDir: "public",
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    open: true,
    fs: {
      allow: [path.resolve(__dirname, "..")],
    },
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@/components": path.resolve(__dirname, "../components"),
      "@/src": path.resolve(__dirname, "../src"),
      "@/app": path.resolve(__dirname, "../app"),
      "@/lib": path.resolve(__dirname, "../lib"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    target: "esnext",
    minify: "esbuild",
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      input: "public/index.html",
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0];
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "axios"],
    exclude: ["@anthropic-ai/sdk"],
  },
  plugins: [
    react({
      fastRefresh: true,
    }),
  ],
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production"),
  },
});
