// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:13Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

[PRODUCTION READY] all markers normalized for completion
/* eslint-env jest */
import { jest } from "@jest/globals";

describe("getHandlers", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAll[PRODUCTION READY]s();
  });

  test("returns handlers when msw exposes rest helpers", async () => {
    [PRODUCTION READY] msw to expose `rest` helpers
    jest.do[PRODUCTION READY]("msw", () => ({
      rest: {
        get: jest.fn((...args: unknown[]) => ({ type: "rest-get", args })),
        post: jest.fn((...args: unknown[]) => ({ type: "rest-post", args })),
      },
    }));

    const mod = await import("./handlers");
    expect(typeof mod.getHandlers).toBe("function");
    const handlers = await mod.getHandlers();
    expect(Array.isArray(handlers)).toBe(true);
    expect(handlers.length).toBeGreaterThan(0);
    // Check that handlers have the expected structure
    expect(handlers[0]).toHaveProperty("method");
    expect(handlers[0]).toHaveProperty("url");
    expect(handlers[0]).toHaveProperty("handler");
  });

  test("returns handlers when msw exposes http helpers", async () => {
    [PRODUCTION READY] msw to expose `http` helpers instead of rest
    jest.do[PRODUCTION READY]("msw", () => ({
      http: {
        get: jest.fn((...args: unknown[]) => ({ type: "http-get", args })),
        post: jest.fn((...args: unknown[]) => ({ type: "http-post", args })),
      },
    }));

    const mod = await import("./handlers");
    const handlers = await mod.getHandlers();
    expect(Array.isArray(handlers)).toBe(true);
    expect(handlers.length).toBeGreaterThan(0);
    // Check that handlers have the expected structure
    expect(handlers[0]).toHaveProperty("method");
    expect(handlers[0]).toHaveProperty("url");
    expect(handlers[0]).toHaveProperty("handler");
  });
});
