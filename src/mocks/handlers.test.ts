/* eslint-env jest */
/* global jest, afterEach, describe, test, expect */
import { jest } from "@jest/globals";

describe("getHandlers", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("returns handlers when msw exposes rest helpers", async () => {
    // Mock msw to expose `rest` helpers
    jest.doMock("msw", () => ({
      rest: {
        get: jest.fn((...args: any[]) => ({ type: "rest-get", args })),
        post: jest.fn((...args: any[]) => ({ type: "rest-post", args })),
      },
    }));

    const mod = await import("./handlers");
    expect(typeof mod.getHandlers).toBe("function");
    const handlers = await mod.getHandlers();
    expect(Array.isArray(handlers)).toBe(true);
    expect(handlers.length).toBeGreaterThan(0);
  });

  test("returns handlers when msw exposes http helpers", async () => {
    // Mock msw to expose `http` helpers instead of rest
    jest.doMock("msw", () => ({
      http: {
        get: jest.fn((...args: any[]) => ({ type: "http-get", args })),
        post: jest.fn((...args: any[]) => ({ type: "http-post", args })),
      },
    }));

    const mod = await import("./handlers");
    const handlers = await mod.getHandlers();
    expect(Array.isArray(handlers)).toBe(true);
    expect(handlers.length).toBeGreaterThan(0);
  });
});
