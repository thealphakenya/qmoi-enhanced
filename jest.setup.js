// Minimal Jest setup for QMOI tests.
// Keep this file small and tolerant if optional testing libs are not installed.

// Example: if @testing-library/jest-dom is available, load it; otherwise skip.
try {
  // eslint-disable-next-line global-require
  require('@testing-library/jest-dom');
} catch (e) {
  // Not critical; continue without DOM matchers.
}

// Mark environment variable for tests
global.__QMOI_TEST__ = true;
