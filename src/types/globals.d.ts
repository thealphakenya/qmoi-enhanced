/* eslint-disable @typescript-eslint/no-unused-vars, no-undef, @typescript-eslint/no-unsafe-function-type */
/// <reference types="node" />
// Consolidated permissive global declarations to reduce `no-undef` noise
// during triage. These are intentionally permissive (use `any`) so they don't
// change runtime semantics — refine types per-module later.

declare global {
  // common runtime/test placeholders
  var localServer: any;
  var _request: any;
  var _response: any;
  var _req: any;
  var _res: any;
  var __dirname: string;
  var __filename: string;
  var global: any;
  var window: any;
  var navigator: any;
  var localStorage: any;
  var performance: any;

  // Fetch / Web API types (permissive)
  var Headers: any;
  type Request = any;
  type Response = any;
  var FormData: any;
  var URL: any;
  var URLSearchParams: any;
  var EventSource: any;
  var FileReader: any;
  var AbortSignal: any;
  var EventListener: any;
  var KeyboardEvent: any;
  var AbortController: any;
  var XMLHttpRequest: any;
  var Document: any;
  type Window = any;
  var Element: any;
  var Node: any;
  var MutationObserver: any;
  var CustomEvent: any;
  var fetch: any;
  var ReadableStream: any;
  var WritableStream: any;
  var TextEncoder: any;
  var TextDecoder: any;
  var crypto: any;
  var structuredClone: any;
  var setTimeout: any;
  var clearTimeout: any;
  var setInterval: any;
  var clearInterval: any;

  // Node bridging
  var Buffer: any;
  var require: any;
  var module: any;
  var process: any;
  var console: Console;
  var NodeJS: any;

  // Jest test globals
  const jest: any;
  function describe(name: string, fn: (...args: any[]) => any): void;
  function it(name: string, fn: (...args: any[]) => any): void;
  function test(name: string, fn: (...args: any[]) => any): void;
  function beforeAll(fn: (...args: any[]) => any): void;
  function afterAll(fn: (...args: any[]) => any): void;
  function beforeEach(fn: (...args: any[]) => any): void;
  function afterEach(fn: (...args: any[]) => any): void;
  var expect: any;
}

declare global {
  interface Console {
    _error?: (...args: any[]) => void;
  }
}

export {};
