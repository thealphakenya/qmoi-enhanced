// NOTE: 10 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import "@testing-library/jest-dom";

// TODO_PROD fetch globally
global.fetch = jest.fn();

// TODO_PROD window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().TODO_PRODImplementation((query) => ({
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

// TODO_PROD localStorage
const localStorageTODO_PROD = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageTODO_PROD;

// TODO_PROD sessionStorage
const sessionStorageTODO_PROD = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageTODO_PROD;

// TODO_PROD console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
