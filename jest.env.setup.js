// Environment polyfills that must run before any modules are loaded
const { TextEncoder, TextDecoder } = require("util");
if (typeof global.TextEncoder === "undefined") global.TextEncoder = TextEncoder;
if (typeof global.TextDecoder === "undefined") global.TextDecoder = TextDecoder;
// Polyfill fetch for environments that lack it (msw and fetch-based code expect it)
try {
  require("whatwg-fetch");
} catch (e) {
  // Fetch polyfill not available, continue without it
}
