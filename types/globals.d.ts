/* eslint-disable @typescript-eslint/no-unused-vars, no-undef, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-empty-object-type */
/// <reference types="node" />
// Consolidated permissive global declarations to reduce `no-undef` noise
// during triage. These are intentionally permissive (use `any`/`unknown`) so
// they don't change runtime semantics — refine types per-module later.

declare global {
  // common runtime globals for Node.js and browser environments
  const localServer: unknown;
  const _request: unknown;
  const response: unknown;
  const _req: unknown;
  const _res: unknown;
  const __dirname: string;
  const __filename: string;
  const global: unknown;
  const window: unknown;
  const navigator: unknown;
  const localStorage: unknown;
  const performance: unknown;

  // Fetch / Web API types (permissive)
  const Headers: unknown;
  type Request = globalThis.Request;
  type Response = globalThis.Response;
  const FormData: unknown;
  const URL: unknown;
  const URLSearchParams: unknown;
  const EventSource: unknown;
  const FileReader: unknown;

  // Node bridging
  const Buffer: unknown; // relaxed type to allow Buffer.* usage in mixed envs
  const require: unknown;
  const module: unknown;
  const process: unknown;
  const console: Console;
  const NodeJS: unknown;
  type full<T> = T;
  function consoleLog(message: string, data?: any): void;
  function safeConsoleError(...args: any[]): void;
  const logger: {
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
    debug: (...args: any[]) => void;
  };
  const apiClient: any;
  const requireMaster: any;
  const prettier: any;
  const MasterLinkValidator: any;

  // Test globals (permissive)
  const describe: any;
  const it: any;
  function test(name: string, fn: (...args: unknown[]) => any): void;
  function beforeAll(fn: (...args: unknown[]) => any): void;
  function afterAll(fn: (...args: unknown[]) => any): void;
  function beforeEach(fn: (...args: unknown[]) => any): void;
  function afterEach(fn: (...args: unknown[]) => any): void;
  const expect: unknown;
}

declare module 'prettier' {
  const prettier: any;
  export default prettier;
  export function format(source: string, options: any): string;
}

export {};
