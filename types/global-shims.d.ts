// Global shims to satisfy runtime globals and Buffer signatures
export {};

declare global {
  // Node/Browser globals used across app/api
  var TextDecoder: any;
  var TextEncoder: any;
  interface Buffer {
    toString(encoding?: string): string;
  }

  // Basic DOM/Request types for Next.js edge-like handlers
  interface Request {}
  interface Headers {}
  interface URLSearchParams {}
}
