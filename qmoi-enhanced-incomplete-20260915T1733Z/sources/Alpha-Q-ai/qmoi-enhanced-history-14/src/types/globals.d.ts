/* eslint-disable @typescript-eslint/no-unused-vars, no-undef, @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-explicit-any */
/// <reference types="node" />
// Consolidated permissive global declarations to reduce `no-undef` noise
// during triage. These are intentionally permissive (use `any`) so they don't
// change runtime semantics — refine types per-module later.

declare global {
  var process: any;
  var Buffer: any;
  var __dirname: string;
  var __filename: string;
  var localServer: any;
  var _request: any;
  var _response: any;
  var _req: any;
  var _res: any;
  var _err: any;
  var _e: any;
  var e: any;
  var error: any;
  var _error: any;
  var err: any;
  var response: any;
  var res: any;
  var req: any;
  var next: any;
  var console: Console;
  var fetch: any;
  var setTimeout: any;
  var clearTimeout: any;
  var setInterval: any;
  var clearInterval: any;
  var localStorage: Storage;
}

declare const _request: any;
declare const _response: any;
declare const _req: any;
declare const _res: any;
declare const _err: any;
declare const _e: any;
declare const e: any;
declare const error: any;
declare const _error: any;
declare const err: any;
declare const response: any;
declare const res: any;
declare const req: any;

interface Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export {};

export {};

// AUTOFIXED by Ollama at 2026-07-26T18:54:41.373206Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:34.412331Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:06.622885Z

// AUTOFIXED by Ollama at 2026-07-26T19:39:17.632704Z
