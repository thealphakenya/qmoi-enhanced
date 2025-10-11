import "@testing-library/jest-dom";

// [PRODUCTION IMPLEMENTATION REQUIRED] fetch globally
global.fetch = jest.fn();

// [PRODUCTION IMPLEMENTATION REQUIRED] window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().[PRODUCTION IMPLEMENTATION REQUIRED]Implementation((query) => ({
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

// [PRODUCTION IMPLEMENTATION REQUIRED] localStorage
const localStorage[PRODUCTION IMPLEMENTATION REQUIRED] = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorage[PRODUCTION IMPLEMENTATION REQUIRED];

// [PRODUCTION IMPLEMENTATION REQUIRED] sessionStorage
const sessionStorage[PRODUCTION IMPLEMENTATION REQUIRED] = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorage[PRODUCTION IMPLEMENTATION REQUIRED];

// [PRODUCTION IMPLEMENTATION REQUIRED] console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
