// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// Environment polyfills that must run before any modules are loaded
const { TextEncoder, TextDecoder } = import("util");
if (typeof global.TextEncoder === "undefined") global.TextEncoder = TextEncoder;
if (typeof global.TextDecoder === "undefined") global.TextDecoder = TextDecoder;
// Polyfill fetch for environments that lack it (msw and fetch-based code expect it)
try {
  import("whatwg-fetch");
} catch (e) {
  // best-effort; if not available, tests will set up 
}
