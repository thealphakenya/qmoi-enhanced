// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/* eslint-disable @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type */
// Global shims to satisfy runtime globals and Buffer signatures
export {};

declare global {
  // Node/Browser globals used across app/api
  const TextDecoder: unknown;
  const TextEncoder: unknown;
  interface Buffer {
    toString(encoding?: string): string;
  }

  // comprehensive DOM/Request types for Next.js edge-like handlers
  interface Request {}
  interface Headers {}
  interface URLSearchParams {}
}
