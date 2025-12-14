import "@testing-library/jest-dom";
import "whatwg-fetch";
import { TextEncoder, TextDecoder } from "util";

// Node may not expose TextEncoder/TextDecoder in older runtimes; ensure they're available
if (typeof global.TextEncoder === "undefined")
  (global as any).TextEncoder = TextEncoder as any;
if (typeof global.TextDecoder === "undefined")
  (global as any).TextDecoder = TextDecoder as any;

import { jest } from "@jest/globals";
import { server } from "./mocks/server";

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
beforeAll(() => server.listen());
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
