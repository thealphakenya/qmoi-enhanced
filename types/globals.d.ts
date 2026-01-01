/* eslint-disable @typescript-eslint/no-unused-vars, no-undef, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-empty-object-type */
/// <reference types="node" />
// Minimal project-wide ambient declarations — keep this lightweight and
// delegate the more comprehensive list to `src/types/globals.d.ts`.

declare global {
  var Headers: any;
  type Request = globalThis.Request;
  type Response = globalThis.Response;
  var Buffer: any;
  var require: any;
  var process: any;
  var __dirname: string;
  var __filename: string;
  const jest: any;
  var EventSource: any;
  var FileReader: any;
  var NodeJS: any;
  function describe(name: string, fn: (...args: any[]) => any): void;
  function it(name: string, fn: (...args: any[]) => any): void;
  function beforeEach(fn: (...args: any[]) => any): void;
  var expect: any;
}

export {};
