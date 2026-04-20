[PRODUCTION_IMPLEMENTED] all markers normalized for completion
/* eslint-env jest */
import { jest } from "@jest/globals";

describe("getHandlers", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAll[PRODUCTION_IMPLEMENTED]s();
  });

  test("returns handlers when msw exposes rest helpers", async () => {
    [PRODUCTION_IMPLEMENTED] msw to expose `rest` helpers
    jest.do[PRODUCTION_IMPLEMENTED]("msw", () => ({
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
  });

  test("returns handlers when msw exposes http helpers", async () => {
    [PRODUCTION_IMPLEMENTED] msw to expose `http` helpers instead of rest
    jest.do[PRODUCTION_IMPLEMENTED]("msw", () => ({
      http: {
        get: jest.fn((...args: unknown[]) => ({ type: "http-get", args })),
        post: jest.fn((...args: unknown[]) => ({ type: "http-post", args })),
      },
    }));

    const mod = await import("./handlers");
    const handlers = await mod.getHandlers();
    expect(Array.isArray(handlers)).toBe(true);
    expect(handlers.length).toBeGreaterThan(0);
  });
});
