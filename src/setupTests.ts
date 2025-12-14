import "@testing-library/jest-dom";
import "whatwg-fetch";
import { TextEncoder, TextDecoder } from "util";

// Node may not expose TextEncoder/TextDecoder in older runtimes; ensure they're available
if (typeof global.TextEncoder === "undefined")
  (global as any).TextEncoder = TextEncoder as any;
if (typeof global.TextDecoder === "undefined")
  (global as any).TextDecoder = TextDecoder as any;

import { jest } from "@jest/globals";
// Delay importing MSW until after early polyfills (setupFiles) run
let server: any;

declare global {
  var localStorage: Storage;
  var sessionStorage: Storage;
  var console: Console;
}

// Ensure fetch exists; if not, provide a Jest mock (MSW will set up an implementation)
if (!global.fetch) {
  global.fetch = jest.fn();
}

// MSW server lifecycle hooks
beforeAll(() => {
  // Ensure stream polyfills are available in this module scope before importing MSW
  try {
    const {
      TransformStream,
      ReadableStream,
      WritableStream,
    } = require("web-streams-polyfill/ponyfill");
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

  // require here so MSW and its interceptors load after global polyfills
  try {
    const { setupServer } = require("msw/node");
    const { handlers } = require("./mocks/handlers");
    server = setupServer(...(handlers || []));
    server.listen();
  } catch (e) {
    // If MSW cannot be loaded (ESM/transform issues), provide a minimal stub
    // so tests that don't require full MSW behavior don't crash.
    // eslint-disable-next-line no-console
    console.warn(
      "MSW not available in test environment:",
      e && e.message ? e.message : e
    );
    server = {
      listen: () => {},
      resetHandlers: () => {},
      close: () => {},
      use: () => {},
    } as any;
  }
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0,
};
global.localStorage = localStorageMock as unknown as Storage;

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
  error: jest.fn(),
};
