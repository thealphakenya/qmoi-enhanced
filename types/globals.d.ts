/* eslint-disable @typescript-eslint/no-unused-vars, no-undef, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-empty-object-type */
/// <reference types="node" />
// Consolidated permissive global declarations to reduce `no-undef` noise
// during triage. These are intentionally permissive (use `any`/`unknown`) so
// they don't change runtime semantics — refine types per-module later.

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
  type Request = globalThis.Request;
  type Response = globalThis.Response;
  var FormData: unknown;
  var URL: unknown;
  var URLSearchParams: unknown;
  var EventSource: unknown;
  var FileReader: unknown;

  // Node bridging
  var Buffer: any; // relaxed type to allow Buffer.* usage in mixed envs
  var require: any;
  var module: any;
  var process: any;
  var console: Console;
  var NodeJS: any;

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

export {};
