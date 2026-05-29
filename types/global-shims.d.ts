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
