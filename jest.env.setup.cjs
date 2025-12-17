// Environment polyfills that must run before any modules are loaded
/* istanbul ignore next: ensure polyfills run before other modules */
const { TextEncoder, TextDecoder } = require("util");
if (typeof global.TextEncoder === "undefined") global.TextEncoder = TextEncoder;
if (typeof global.TextDecoder === "undefined") global.TextDecoder = TextDecoder;
// Polyfill fetch for environments that lack it (msw and fetch-based code expect it)
try {
  require("whatwg-fetch");
} catch (e) {
  // best-effort; if not available, tests will set up mocks
}
// Ensure Web Streams APIs exist for libraries that expect browser streams
try {
  const {
    TransformStream,
    ReadableStream,
    WritableStream,
  } = require("web-streams-polyfill");
  // Attach to multiple global objects to cover different runtime module scopes
  if (typeof global.TransformStream === "undefined")
    global.TransformStream = TransformStream;
  if (typeof global.ReadableStream === "undefined")
    global.ReadableStream = ReadableStream;
  if (typeof global.WritableStream === "undefined")
    global.WritableStream = WritableStream;
  if (typeof globalThis !== "undefined") {
    if (typeof globalThis.TransformStream === "undefined")
      globalThis.TransformStream = TransformStream;
    if (typeof globalThis.ReadableStream === "undefined")
      globalThis.ReadableStream = ReadableStream;
    if (typeof globalThis.WritableStream === "undefined")
      globalThis.WritableStream = WritableStream;
  }
  if (typeof window !== "undefined") {
    if (typeof window.TransformStream === "undefined")
      window.TransformStream = TransformStream;
    if (typeof window.ReadableStream === "undefined")
      window.ReadableStream = ReadableStream;
    if (typeof window.WritableStream === "undefined")
      window.WritableStream = WritableStream;
  }
  if (typeof self !== "undefined") {
    if (typeof self.TransformStream === "undefined")
      self.TransformStream = TransformStream;
    if (typeof self.ReadableStream === "undefined")
      self.ReadableStream = ReadableStream;
    if (typeof self.WritableStream === "undefined")
      self.WritableStream = WritableStream;
  }
} catch (e) {
  // best-effort
}
// Polyfill BroadcastChannel used by some MSW internals (ws support)
try {
  if (typeof global.BroadcastChannel === "undefined") {
    class _BroadcastChannel {
      constructor(name) {
        this.name = name;
        this.onmessage = null;
      }
      postMessage(_msg) {
        // no-op for tests
      }
      close() {}
      addEventListener() {}
      removeEventListener() {}
    }
    global.BroadcastChannel = _BroadcastChannel;
    if (typeof globalThis !== "undefined")
      globalThis.BroadcastChannel = _BroadcastChannel;
    if (typeof window !== "undefined")
      window.BroadcastChannel = _BroadcastChannel;
  }
} catch (e) {
  // ignore
}
// Start MSW server early to ensure interceptors are active before tests run.
// This avoids network calls that can happen during module initialization.
try {
  // Require the already-prepared server (it uses `setupServer()` with no handlers)
  // and call `listen()` so request interception is active.
  // Use a relative path to the source so Jest can transform it as needed.
  // eslint-disable-next-line global-require
  const { server } = require("./src/mocks/server");
  if (server && typeof server.listen === "function") {
    server.listen();
    // Log minimally to help debugging in CI if needed.
    // console.log("EARLY_MSW: server.listen called in setupFiles");
  }
} catch (e) {
  // Best-effort: if MSW cannot be initialized here, tests will attempt
  // to initialize it in `src/setupTests.ts` instead.
  // console.error("EARLY_MSW failed to initialize:", e);
}

// No early MSW fallback here. MSW is initialized in `src/setupTests.ts`
// to ensure ESM imports and polyfills are applied in the correct order.
