/* eslint-disable @typescript-eslint/no-unused-vars, no-undef, @typescript-eslint/no-unsafe-function-type */
/// <reference types="node" />
// Consolidated permissive global declarations to reduce `no-undef` noise
// during triage. These are intentionally permissive (use `any`) so they don't
// change runtime semantics — refine types per-module later.

declare global {
  // common runtime/test placeholders
  var localServer: unknown;
  var _request: unknown;
  var _response: unknown;
  var _req: unknown;
  var _res: unknown;
  var __dirname: string;
  var __filename: string;
  var global: unknown;
  var window: unknown;
  var navigator: unknown;
  var localStorage: unknown;
  var performance: unknown;

  // Fetch / Web API types (permissive)
  var Headers: unknown;
  type Request = any;
  type Response = any;
  var FormData: unknown;
  var URL: unknown;
  var URLSearchParams: unknown;
  var EventSource: unknown;
  var FileReader: unknown;
  var AbortSignal: unknown;
  var EventListener: unknown;
  var KeyboardEvent: unknown;
  var AbortController: unknown;
  var XMLHttpRequest: unknown;
  var Document: unknown;
  type Window = any;
  var Element: unknown;
  var Node: unknown;
  var MutationObserver: unknown;
  var CustomEvent: unknown;
  var fetch: unknown;
  var ReadableStream: unknown;
  var WritableStream: unknown;
  var TextEncoder: unknown;
  var TextDecoder: unknown;
  var crypto: unknown;
  var structuredClone: unknown;
  var setTimeout: unknown;
  var clearTimeout: unknown;
  var setInterval: unknown;
  var clearInterval: unknown;

  // Node bridging
  var Buffer: unknown;
  var require: unknown;
  var module: unknown;
  var process: unknown;
  var console: Console;
  var NodeJS: unknown;

  // Jest test globals
  const jest: unknown;
  function describe(name: string, fn: (...args: unknown[]) => any): void;
  function it(name: string, fn: (...args: unknown[]) => any): void;
  function test(name: string, fn: (...args: unknown[]) => any): void;
  function beforeAll(fn: (...args: unknown[]) => any): void;
  function afterAll(fn: (...args: unknown[]) => any): void;
  function beforeEach(fn: (...args: unknown[]) => any): void;
  function afterEach(fn: (...args: unknown[]) => any): void;
  var expect: unknown;
}

declare global {
  interface Console {
    _error?: (...args: unknown[]) => void;
  }
}

export {};
