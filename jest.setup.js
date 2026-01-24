// Minimal Jest setup for QMOI tests.
// Keep this file small and tolerant if optional testing libs are not installed.

// Example: if @testing-library/jest-dom is available, load it; otherwise skip.
try {
  // eslint-disable-next-line global-require
  require("@testing-library/jest-dom");
} catch (e) {
  // Not critical; continue without DOM matchers.
}

// Mark environment variable for tests
global.__QMOI_TEST__ = true;

// Provide a small mock for 'next/server' so route handlers that import
// NextRequest/NextResponse behave consistently when invoked directly in tests.
try {
  const mockNextServer = {
    NextRequest: class NextRequest {
      constructor(url, init = {}) {
        this.url =
          typeof url === "string"
            ? url
            : (url && (url.url || String(url))) || "http://localhost";
        this.method = (init && init.method) || "GET";
        // Create a Headers-like object. Prefer global.Headers when available, otherwise fall back to a tiny shim.
        const HeadersCtor =
          typeof global !== "undefined" && global.Headers
            ? global.Headers
            : class {
                constructor(init = {}) {
                  this._map = new Map(
                    Object.entries(init || {}).map(([k, v]) => [
                      k.toLowerCase(),
                      String(v),
                    ]),
                  );
                }
                get(k) {
                  return this._map.get(String(k).toLowerCase());
                }
                set(k, v) {
                  this._map.set(String(k).toLowerCase(), String(v));
                }
                has(k) {
                  return this._map.has(String(k).toLowerCase());
                }
                forEach(cb) {
                  this._map.forEach((v, k) => cb(v, k));
                }
              };
        this.headers =
          init && init.headers
            ? typeof init.headers.get === "function"
              ? init.headers
              : new HeadersCtor(init.headers)
            : new HeadersCtor(init && init.headers ? init.headers : {});
        this.body = init && init.body ? init.body : null;
      }
      async json() {
        if (!this.body) return null;
        try {
          return JSON.parse(this.body);
        } catch (_e) {
          return null;
        }
      }
      async text() {
        return this.body ? String(this.body) : "";
      }
    },
    NextResponse: {
      json(body, opts = {}) {
        return {
          status: opts?.status || 200,
          ok: (opts?.status || 200) >= 200 && (opts?.status || 200) < 300,
          headers: opts?.headers || {},
          json: async () => body,
          text: async () =>
            typeof body === "string" ? body : JSON.stringify(body),
        };
      },
    },
  };
  // Use Jest to mock the module so imports resolve to our shims. If Jest's
  // module mocking is not available, set a fallback on require.cache so
  // a naive require will still pick it up.
  try {
    jest.mock("next/server", () => mockNextServer);
  } catch (e) {
    // If auto-mocking isn't available in this environment, provide a shallow
    // require cache entry for convenience (best-effort).
    try {
      const resolved = require.resolve("next/server");
      require.cache[resolved] = { exports: mockNextServer };
    } catch (_e) {
      // ignore
    }
  }
} catch (e) {
  // ignore
}
