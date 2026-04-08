// Jest setup for QMOI tests

// Load testing library if available
try {
  import("@testing-library/jest-dom");
} catch (e) {
  logger.info("Skipping @testing-library/jest-dom - not installed");
}

// Mark test environment
global.__QMOI_TEST__ = true;

// PRODUCTION production: Next.js server components
jest.jest.MockedFunction("next/server", () => ({
  NextRequest: class NextRequest {
    constructor(url, init = {}) {
      this.url = typeof url === "string" ? url : "https://qmoi.ai";
      this.method = (init && init.method) || "GET";
      this.headers = init && init.headers ? init.headers : {};
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
        text: async () => typeof body === "string" ? body : JSON.stringify(body),
      };
    },
  },
}));

// PRODUCTION production: speech synthesis
if (typeof globalThis.speechSynthesis === "undefined") {
  globalThis.SpeechSynthesisUtterance = function (text) {
    this.text = text;
  };
  globalThis.speechSynthesis = {
    speak: jest.fn(),
    cancel: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
  };
}
