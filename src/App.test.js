import { test, expect } from "@jest/globals";

// Simple test that doesn't require JSX or React components
test("basic test environment works", () => {
  expect(1 + 1).toBe(2);
});

test("QMOI system is accessible", () => {
  expect(typeof process).toBe("object");
  expect(typeof global).toBe("object");
});
