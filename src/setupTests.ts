/* eslint-env node, jest */
/* global require */
// @ts-nocheck
import "@testing-library/jest-dom";
import "whatwg-fetch";
import { TextEncoder, TextDecoder } from "util";

// Node may not expose TextEncoder/TextDecoder in older runtimes; ensure they're available
if (typeof global.TextEncoder === "undefined")
  (global as any).TextEncoder = TextEncoder as any;
if (typeof global.TextDecoder === "undefined")
  (global as any).TextDecoder = TextDecoder as any;

import { jest, beforeAll, afterAll, afterEach } from "@jest/globals";
// Verify hook availability (kept minimal)
const TEST_VERBOSE = process.env.TEST_VERBOSE === "1" || false;
const debugLog = (...args: unknown[]) => {
  if (TEST_VERBOSE) console.debug(...args);
};

debugLog(
  "SETUP_TESTS: hooks -> beforeAll:",
  typeof beforeAll,
  "global.beforeAll:",
  typeof (globalThis as any).beforeAll
);
// Delay importing MSW until after early polyfills (setupFiles) run
let server: any;
let mswReady = false;

declare global {
  var localStorage: Storage;
  var sessionStorage: Storage;
  var console: Console;
}

// Augment Console with a non-standard `_error` helper used in test setup
declare global {
  interface Console {
    _error?: (...args: unknown[]) => void;
  }
}

// Ensure fetch exists; if not, provide a Jest mock (MSW will set up an implementation)
if (!global.fetch) {
  // jest.fn() typing is not compatible with the global fetch signature; coerce
  // to any for test setup.
  (global as any).fetch = jest.fn() as any;
}

// MSW server lifecycle: initialize at module load so interceptors are active
// before unknown test modules run. When running under Node (no `window`) we skip
// MSW initialization to avoid ESM/loader issues and unnecessary browser
// polyfills for node-only integration tests.
let mswInitPromise: Promise<unknown>;
if (typeof window === "undefined") {
  debugLog(
    "SETUP_TESTS: detected Node test environment; skipping MSW initialization"
  );
  mswInitPromise = Promise.resolve();
  // Provide a minimal server object so downstream logic can safely call methods
  server = {
    use: () => undefined,
    listen: () => undefined,
    close: () => undefined,
    resetHandlers: () => undefined,
  } as any;
  // Expose readiness promise for compatibility
  (globalThis as any).__MSW_READY__ = mswInitPromise;
} else {
  // Initialize MSW only in environments that look like browsers/jsdom
  mswInitPromise = (async function initializeMswAtLoad() {
    debugLog("SETUP_TESTS: initializing MSW at module load");
    // Ensure stream polyfills are available in this module scope before importing MSW
    try {
      /* eslint-disable @typescript-eslint/no-require-imports */
      const {
        TransformStream,
        ReadableStream,
        WritableStream,
      } = require("web-streams-polyfill");
      /* eslint-enable @typescript-eslint/no-require-imports */
      if (typeof (global as any).TransformStream === "undefined")
        (global as any).TransformStream = TransformStream;
      if (typeof (global as any).ReadableStream === "undefined")
        (global as any).ReadableStream = ReadableStream;
      if (typeof (global as any).WritableStream === "undefined")
        (global as any).WritableStream = WritableStream;
      if (typeof globalThis !== "undefined") {
        if (typeof (globalThis as any).TransformStream === "undefined")
          (globalThis as any).TransformStream = TransformStream;
      }
    } catch (_e) {
      // ignore
    }

    // MSW readiness flag (used by the fetch fallback)

    try {
      // Dynamically import MSW to let the ESM loader handle its deps.
      debugLog("SETUP_TESTS: importing msw/node...");
      const msw = await import("msw/node");
      debugLog("SETUP_TESTS: imported msw/node successfully");
      const handlersMod = await import("./mocks/handlers");
      debugLog(
        "SETUP_TESTS: imported handlers module",
        Object.keys(handlersMod)
      );
      const { server: importedServer } = await import("./mocks/server");
      debugLog("SETUP_TESTS: imported server module");

      // Support both async getter and synchronous exports
      let handlers: unknown[] = [];
      if (typeof handlersMod.getHandlers === "function") {
        try {
          debugLog("SETUP_TESTS: invoking handlersMod.getHandlers()");
          handlers = await (handlersMod as any).getHandlers();
          debugLog("SETUP_TESTS: handlers resolved length=", handlers.length);
        } catch (_err) {
          void _err;
          // Fail fast: handlers must initialize correctly for tests to be valid
          console.error("SETUP_TESTS: handlersMod.getHandlers() threw:", _err);
          throw _err;
        }
      } else {
        handlers =
          (handlersMod as any).handlers || (handlersMod as any).default || [];
        debugLog("SETUP_TESTS: handlers (sync) length=", handlers.length);
      }

      // Register handlers on the shared server and start it
      debugLog("SETUP_TESTS: registering handlers on server", handlers.length);
      if ((handlers as any[]).length)
        (importedServer as any).use(...(handlers as any));
      // Log unhandled requests to aid debugging when handlers don't match. By
      // default we suppress these unless explicitly enabled in CI/dev by
      // setting SHOW_MSW_UNHANDLED=1.
      importedServer.listen({
        onUnhandledRequest: (_req) => {
          try {
            if (process.env.SHOW_MSW_UNHANDLED === "1") {
              console.error(
                "MSW UNHANDLED REQUEST:",
                (_req as any).method,
                String((_req as any).url)
              );
            } else {
              debugLog(
                "MSW UNHANDLED REQUEST (suppressed):",
                (_req as any).method,
                String((_req as any).url)
              );
            }
          } catch (_err) {
            void _err;
            // ignore malformed _request objects
          }
        },
      });
      debugLog("SETUP_TESTS: server.listen() called");
      server = importedServer;
      debugLog(
        "SETUP_TESTS: MSW initialized; handlers registered",
        handlers.length
      );
    } catch (_e) {
      // Log errors to surface them in CI/dev runs
      console.error("setupTests failed to initialize MSW:", _e);
      // Fallback: if MSW cannot be initialized (ESM/loader issues), install a
      // minimal fetch-based mock so tests don't hit the network. This mirrors
      // the most common handlers used in tests.
      console.error(
        "SETUP_TESTS: Falling back to simple fetch mock server for tests"
      );

      const fallbackHandlers = [
        {
          method: "GET",
          path: "/api/qmoi/status",
          handler: async () =>
            new Response(
              JSON.stringify({
                status: "OK",
                last_check: "2024-06-01T12:00:00Z",
                mutation_count: 5,
                logs: ["Log 1", "Log 2"],
              }),
              {
                status: 200,
                headers: { "Content-Type": "application/json" },
              }
            ),
        },
        {
          method: "POST",
          path: "/api/qmoi/payload",
          handler: async (_req: unknown) => {
            const url =
              typeof _req === "string"
                ? new URL(_req, "http://localhost")
                : (_req as any)?.url || "http://localhost";
            const q =
              typeof url === "string" ? new URL(url, "http://localhost") : url;
            const action =
              q.searchParams && q.searchParams.get("qfix")
                ? "QFix"
                : q.searchParams && q.searchParams.get("qoptimize")
                ? "QOptimize"
                : q.searchParams && q.searchParams.get("qsecure")
                ? "QSecure"
                : "Unknown";
            return new Response(JSON.stringify({ message: `${action} done` }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          },
        },
      ];

      // Replace global.fetch with a simple router that matches the fallback handlers.
      try {
        const originalFetch = (global as any).fetch;
        (global as any).fetch = async function fetchFallback(
          input: unknown,
          init: unknown
        ) {
          try {
            const url =
              typeof input === "string" ? input : (input as any)?.url || "";
            const u = new URL(url, "http://localhost");
            const method = ((init as any) && (init as any).method) || "GET";
            for (const h of fallbackHandlers) {
              if (h.method === method && h.path === u.pathname) {
                return (h as any).handler(u);
              }
            }
          } catch (er) {
            // ignore parsing errors and fall through to original fetch
          }
          return (originalFetch as any).apply(globalThis, [input, init]);
        } as any;
      } catch (er) {
        console.error("SETUP_TESTS: failed to install fetch fallback:", er);
      }

      // Provide a minimal server object with the same interface used elsewhere
      server = {
        use: () => undefined,
        listen: () => undefined,
        close: () => undefined,
        resetHandlers: () => undefined,
      } as any;
    }
  })();
}

// Expose readiness promise so tests can explicitly await MSW initialization
(globalThis as any).__MSW_READY__ = mswInitPromise;

// Ensure Jest waits for MSW to finish initializing before unknown tests run.
// This ensures XHR requests (which bypass our fetch wrapper) won't race ahead.
beforeAll(async () => {
  await mswInitPromise;
  debugLog("SETUP_TESTS: msw ready (awaited in beforeAll)");
});

// Wrap global.fetch so test code (and components) will wait for MSW to be ready
try {
  const originalFetch = global.fetch;
  if (typeof originalFetch === "function") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-unknown
    (global as any).fetch = async function fetchWithMswReady(
      ...args: unknown[]
    ) {
      await mswInitPromise.catch(() => {});
      try {
        const input = args[0];
        const url =
          typeof input === "string" ? input : (input as any)?.url || "";
        debugLog("FETCH CALL:", url);
      } catch (_e) {
        // ignore
      }
      return (originalFetch as any).apply(globalThis, args);
    } as any;
  }
} catch (_e) {
  // ignore
}

afterEach(() => {
  try {
    if (server) (server as any).resetHandlers();
  } catch (_e) {
    console.error("SETUP_TESTS: server.resetHandlers() failed:", _e);
  }
});
afterAll(() => {
  try {
    if (server) (server as any).close();
  } catch (_e) {
    // Non-fatal: avoid failing the test run due to cleanup errors. If you'd
    // like to see these details, set SHOW_MSW_UNHANDLED=1 to surface them.
    console.warn("SETUP_TESTS: server.close() failed (suppressed):", _e);
  }
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0,
};
global.sessionStorage = sessionStorageMock as any as Storage;

// Mock console methods to reduce noise in tests
// Ensure `_error` exists on console (fall back to `console.error`)
if (!console._error) console._error = console.error;
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  // keep errors visible so setup failures surface in CI and dev runs
  _error: console._error,
};
