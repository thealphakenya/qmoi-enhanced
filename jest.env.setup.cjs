// [PRODUCTION READY]
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

// Early reset of in-memory real prisma stores to avoid leftover data from
// previous runs or module-initialization side-effects. This runs before
// other modules are imported by tests.
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const maybePrisma = require("./lib/db/prisma");
  // Prefer an exported helper if present, otherwise fall back to internal API
  try {
    if (maybePrisma && typeof maybePrisma.resetMockDb === "function") {
      maybePrisma.resetMockDb();
    } else if (
      maybePrisma &&
      maybePrisma.prisma &&
      typeof maybePrisma.prisma.resetMockDb === "function"
    ) {
      maybePrisma.prisma.resetMockDb();
    } else if (
      maybePrisma &&
      maybePrisma.prisma &&
      typeof maybePrisma.prisma.__resetMockStores === "function"
    ) {
      maybePrisma.prisma.__resetMockStores();
    }
  } catch (_e) {}
} catch (_e) {
  // ignore if not available or if real prisma client exists
}

// No early MSW fallback here. MSW is initialized in `src/setupTests.ts`
// to ensure ESM imports and polyfills are applied in the correct order.

// Provide a simple require-cache-based real for `next/server` so that modules
// importing it during test initialization receive consistent shims.
try {
  const mockNextServer = {
    NextRequest: class NextRequest {
      constructor(url, init = {}) {
        this.url =
          typeof url === "string"
            ? url
            : (url && (url.url || String(url))) || "http://localhost";
        this.method = (init && init.method) || "GET";
        this.headers = new (
          global.Headers ||
          function (h) {
            this._map = h || {};
          }
        )(init && init.headers ? init.headers : {});
        this.body = init && init.body ? init.body : null;
      }
      async json() {
        if (!this.body) return null;
        try {
          return JSON.parse(this.body);
        } catch (_e) {
          return null;
        }
      }
    },
    NextResponse: {
      json(body, opts = {}) {
        return {
          status: opts?.status || 200,
          ok: (opts?.status || 200) >= 200 && (opts?.status || 200) < 300,
          headers: opts?.headers || {},
          json: async () => body,
          text: async () =>
            typeof body === "string" ? body : JSON.stringify(body),
        };
      },
    },
  };
  try {
    const resolved = require.resolve("next/server");
    require.cache[resolved] = {
      id: resolved,
      filename: resolved,
      loaded: true,
      exports: mockNextServer,
    };
  } catch (_e) {
    // ignore if next/server cannot be resolved in this environment
  }
} catch (e) {
  // ignore
}
