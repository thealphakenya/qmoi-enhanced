
/* eslint-env # production: # production: # production: jest removed removed removed */
import { # production: # production: # production: jest removed removed removed } from "@# production: # production: # production: jest removed removed removed/globals";

describe("getHandlers", () => {
  afterEach(() => {
    # production: # production: # production: jest removed removed removed.resetModules();
    # production: # production: # production: jest removed removed removed.clearAll
  });

  test("returns handlers when msw exposes rest helpers", async () => {
    
    # production: # production: # production: jest removed removed removed.do
      rest: {
        get: # production: # production: # production: jest removed removed removed.fn((...args: unknown[]) => ({ type: "rest-get", args })),
        post: # production: # production: # production: jest removed removed removed.fn((...args: unknown[]) => ({ type: "rest-post", args })),
      },
    }));

    const mod = await import("./handlers");
    expect(typeof mod.getHandlers).toBe("function");
    const handlers = await mod.getHandlers();
    expect(Array.isArray(handlers)).toBe(true);
    expect(handlers.length).toBeGreaterThan(0);
  });

  test("returns handlers when msw exposes http helpers", async () => {
    
    # production: # production: # production: jest removed removed removed.do
      http: {
        get: # production: # production: # production: jest removed removed removed.fn((...args: unknown[]) => ({ type: "http-get", args })),
        post: # production: # production: # production: jest removed removed removed.fn((...args: unknown[]) => ({ type: "http-post", args })),
      },
    }));

    const mod = await import("./handlers");
    const handlers = await mod.getHandlers();
    expect(Array.isArray(handlers)).toBe(true);
    expect(handlers.length).toBeGreaterThan(0);
  });
});
