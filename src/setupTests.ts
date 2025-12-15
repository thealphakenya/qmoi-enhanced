import "@testing-library/jest-dom";
import "whatwg-fetch";
import { TextEncoder, TextDecoder } from "util";

// Node may not expose TextEncoder/TextDecoder in older runtimes; ensure they're available
if (typeof global.TextEncoder === "undefined")
  (global as any).TextEncoder = TextEncoder as any;
if (typeof global.TextDecoder === "undefined")
  (global as any).TextDecoder = TextDecoder as any;

import { jest, beforeAll, afterAll, afterEach } from "@jest/globals";
// Verify hook availability
console.log(
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

// Ensure fetch exists; if not, provide a Jest mock (MSW will set up an implementation)
if (!global.fetch) {
  global.fetch = jest.fn();
}

// MSW server lifecycle: initialize at module load so interceptors are active
// before any test modules run.
const mswInitPromise = (async function initializeMswAtLoad() {
  console.log("SETUP_TESTS: initializing MSW at module load");
  // Ensure stream polyfills are available in this module scope before importing MSW
  try {
    const {
      TransformStream,
      ReadableStream,
      WritableStream,
    } = require("web-streams-polyfill");
    if (typeof global.TransformStream === "undefined")
      global.TransformStream = TransformStream;
    if (typeof global.ReadableStream === "undefined")
      global.ReadableStream = ReadableStream;
    if (typeof global.WritableStream === "undefined")
      global.WritableStream = WritableStream;
    if (typeof globalThis !== "undefined") {
      if (typeof globalThis.TransformStream === "undefined")
        globalThis.TransformStream = TransformStream;
    }
  } catch (e) {
    // ignore
  }

  // MSW readiness flag (used by the fetch fallback)

  try {
    // Dynamically import MSW to let the ESM loader handle its deps.
    console.error("SETUP_TESTS: importing msw/node...");
    const msw = await import("msw/node");
    console.error("SETUP_TESTS: imported msw/node successfully");
    const handlersMod = await import("./mocks/handlers");
    console.error(
      "SETUP_TESTS: imported handlers module",
      Object.keys(handlersMod)
    );
    const { server: importedServer } = await import("./mocks/server");
    console.log("SETUP_TESTS: imported server module");

    // Support both async getter and synchronous exports
    let handlers: any[] = [];
    if (typeof handlersMod.getHandlers === "function") {
      try {
        console.error("SETUP_TESTS: invoking handlersMod.getHandlers()");
        handlers = await handlersMod.getHandlers();
        console.error(
          "SETUP_TESTS: handlers resolved length=",
          handlers.length
        );
      } catch (err) {
        // Fail fast: handlers must initialize correctly for tests to be valid
        console.error("SETUP_TESTS: handlersMod.getHandlers() threw:", err);
        throw err;
      }
    } else {
      handlers = handlersMod.handlers || handlersMod.default || [];
      console.error("SETUP_TESTS: handlers (sync) length=", handlers.length);
    }

    // Register handlers on the shared server and start it
    console.error(
      "SETUP_TESTS: registering handlers on server",
      handlers.length
    );
    if (handlers.length) importedServer.use(...handlers);
    // Log unhandled requests to aid debugging when handlers don't match
    importedServer.listen({
      onUnhandledRequest: (req) =>
        console.error("MSW UNHANDLED REQUEST:", req.method, String(req.url)),
    });
    console.error("SETUP_TESTS: server.listen() called");
    server = importedServer;
    console.error(
      "SETUP_TESTS: MSW initialized; handlers registered",
      handlers.length
    );
  } catch (e) {
    // Log errors to surface them in CI/dev runs
    console.error("setupTests failed to initialize MSW:", e);
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
        handler: async (req: any) => {
          const url =
            typeof req === "string"
              ? new URL(req, "http://localhost")
              : req.url;
          const q =
            typeof url === "string" ? new URL(url, "http://localhost") : url;
          const action = q.searchParams.get("qfix")
            ? "QFix"
            : q.searchParams.get("qoptimize")
            ? "QOptimize"
            : q.searchParams.get("qsecure")
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
      const originalFetch = global.fetch;
      (global as any).fetch = async function fetchFallback(
        input: any,
        init: any
      ) {
        try {
          const url = typeof input === "string" ? input : input?.url || "";
          const u = new URL(url, "http://localhost");
          const method = (init && init.method) || "GET";
          for (const h of fallbackHandlers) {
            if (h.method === method && h.path === u.pathname) {
              return h.handler(u);
            }
          }
        } catch (er) {
          // ignore parsing errors and fall through to original fetch
        }
        return originalFetch.apply(this, [input, init]);
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

// Expose readiness promise so tests can explicitly await MSW initialization
(globalThis as any).__MSW_READY__ = mswInitPromise;

// Ensure Jest waits for MSW to finish initializing before any tests run.
// This ensures XHR requests (which bypass our fetch wrapper) won't race ahead.
beforeAll(async () => {
  await mswInitPromise;
  console.log("SETUP_TESTS: msw ready (awaited in beforeAll)");
});

// Wrap global.fetch so test code (and components) will wait for MSW to be ready
try {
  const originalFetch = global.fetch;
  if (typeof originalFetch === "function") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).fetch = async function fetchWithMswReady(...args: any[]) {
      await mswInitPromise.catch(() => {});
      return originalFetch.apply(this, args);
    } as any;
  }
} catch (e) {
  // ignore
}

afterEach(() => server && server.resetHandlers());
afterAll(() => server && server.close());

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0,
};
global.sessionStorage = sessionStorageMock as unknown as Storage;

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  // keep errors visible so setup failures surface in CI and dev runs
  error: console.error,
};
