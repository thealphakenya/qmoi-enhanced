
/* eslint-env jest */
import { jest } from "@jest/globals";

describe("getHandlers", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAll
  });

  test("returns handlers when msw exposes rest helpers", async () => {
    
    jest.do
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
    
    jest.do
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
