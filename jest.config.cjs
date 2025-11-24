/**
 * Root Jest configuration for QMOI monorepo / multi-package repository.
 * - Conservative defaults for TypeScript + React testing (ts-jest)
 * - Excludes generated folders and node_modules
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/**/*.test.[jt]s?(x)',
    '<rootDir>/**/*.spec.[jt]s?(x)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/', '/.qmoi_validation/'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__mocks__/**',
    '!src/**/__tests__/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 75,
      statements: 75
    }
  },
  cacheDirectory: '<rootDir>/.jest_cache',
  verbose: false,
  roots: ['<rootDir>']
};
