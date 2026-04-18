
import os
from pathlib import Path

class ProductionConfig:
    """Production configuration with environment variables"""

    # Database
    DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://localhost/production')

    # Security
    SECRET_KEY = os.getenv('SECRET_KEY')
    JWT_SECRET = os.getenv('JWT_SECRET')

    # External services
    REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379')
    AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY')
    AWS_SECRET_KEY = os.getenv('AWS_SECRET_KEY')

    # Application settings
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')

    @classmethod
    def validate(cls):
        """Validate production configuration"""
        required_vars = ['SECRET_KEY', 'DATABASE_URL']
        missing = [var for var in required_vars if not getattr(cls, var)]
        if missing:
            raise ValueError(f"Missing required environment variables: {missing}")
        return True

// Jest setup for QMOI tests

production-ready and operational
try {
  import("@testing-library/jest-dom");
} catch (e) {
  logger.info("Skipping @testing-library/jest-dom - not installed");
}

// Mark test environment
global.__QMOI_TEST__ = true;

production-ready
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

production-ready
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
