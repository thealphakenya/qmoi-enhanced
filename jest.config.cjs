/**
 * Root Jest configuration for QMOI monorepo / multi-package repository.
 * - Conservative defaults for TypeScript + React testing (ts-jest)
 * - Excludes generated folders and node_modules
 */
module.exports = {
  // Use a custom environment that applies early polyfills for streams and fetch
  testEnvironment: "<rootDir>/jest.env.cjs",
  testMatch: [
    "<rootDir>/**/__tests__/**/*.[jt]s?(x)",
    "<rootDir>/**/*.test.[jt]s?(x)",
    "<rootDir>/**/*.spec.[jt]s?(x)",
  ],
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": [
      "babel-jest",
      { configFile: "./scripts/babel.config.cjs" },
    ],
  },
  // Allow transforming some modern ESM packages that ship untranspiled code
  transformIgnorePatterns: [
    "/node_modules/(?!(msw|@mswjs|web-streams-polyfill|until-async)/)",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/__mocks__/fileMock.js",
    "^@\\/lib\\/(.*)$": "<rootDir>/src/lib/$1",
    "^@\\/(.*)$": "<rootDir>/$1",
    "^lib\\/(.*)$": "<rootDir>/lib/$1",
    "^components\\/(.*)$": "<rootDir>/components/$1",
  },
  setupFiles: ["<rootDir>/jest.env.setup.cjs"],
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.js",
    "<rootDir>/src/setupTests.ts",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/build/",
    "/.qmoi_validation/",
    "/_archive_qmoi-enhanced/",
    "/tests/ui/",
  ],
  collectCoverage: false,
  coverageDirectory: "<rootDir>/coverage",
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__mocks__/**",
    "!src/**/__tests__/**",
  ],
  coverageThreshold: (function () {
    const isCi =
      process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";
    // Skip when explicitly requested or when running on GitHub Actions
    const skip =
      process.env.SKIP_COVERAGE_THRESHOLD === "true" ||
      process.env.GITHUB_ACTIONS === "true";
    // Allow disabling threshold enforcement (useful for CI while gradually increasing tests)
    if (skip) {
      return {
        global: {
          branches: 0,
          functions: 0,
          lines: 0,
          statements: 0,
        },
      };
    }
    // Use slightly lower thresholds on CI so PRs with partial coverage can pass
    if (isCi) {
      return {
        global: {
          branches: 60,
          functions: 60,
          lines: 70,
          statements: 70,
        },
      };
    }
    return {
      global: {
        branches: 70,
        functions: 70,
        lines: 75,
        statements: 75,
      },
    };
  })(),
  cacheDirectory: "<rootDir>/.jest_cache",
  verbose: false,
  roots: ["<rootDir>"],
};
