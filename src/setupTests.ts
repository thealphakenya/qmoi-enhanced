import '@testing-library/jest-dom';

if (typeof globalThis.fetch === 'undefined') {
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
    text: async () => '',
  }) as any;
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

globalThis.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
} as any;

globalThis.console = {
  ...console,
  log: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
} as any;
