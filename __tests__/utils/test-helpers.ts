/**
 * Test Utilities and Helpers
 * Provides common utilities for API testing
 */

import authService from "@/lib/auth/service";
import db from "@/lib/db/services";
import { NextRequest } from "next/server";

/**
 * Create authenticated request with JWT token
 */
export function createAuthenticatedRequest(
  url: string,
  method: string = "GET",
  userId: string = "test-user-id",
  body?: Record<string, unknown>
): NextRequest {
  const token = authService.generateToken({
    userId,
    email: "test@example.com",
    username: "testuser",
    role: "user",
  });

  const headers: HeadersInit = {
    authorization: `Bearer ${token}`,
    "content-type": "application/json",
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return new NextRequest(url, options);
}

/**
 * Create test user with random email
 */
export async function createTestUser(
  overrides: Partial<{
    email: string;
    username: string;
    name: string;
  }> = {}
) {
  const timestamp = Date.now();
  const user = await db.userService.create({
    email: overrides.email || `test-${timestamp}@example.com`,
    username: overrides.username || `testuser${timestamp}`,
    name: overrides.name || "Test User",
  });

  return user;
}

/**
 * Create test wallet for user
 */
export async function createTestWallet(
  userId: string,
  currency: string = "KES"
) {
  const wallet = await db.walletService.create(userId, currency);
  return wallet;
}

/**
 * Create test transaction
 */
export async function createTestTransaction(
  walletId: string,
  amount: number = 100,
  type: string = "deposit",
  status: string = "pending"
) {
  const transaction = await db.transactionService.create({
    walletId,
    type,
    amount,
    status,
  });

  return transaction;
}

/**
 * Mock HTTP request with custom headers
 */
export function mockRequest(
  url: string,
  method: string = "GET",
  headers: Record<string, string> = {},
  body?: unknown
): NextRequest {
  const requestInit: RequestInit = {
    method,
    headers: {
      "content-type": "application/json",
      ...headers,
    },
  };

  if (body) {
    requestInit.body = JSON.stringify(body);
  }

  return new NextRequest(url, requestInit);
}

/**
 * Assert JSON response
 */
export async function assertJsonResponse(response: Response) {
  expect(response.headers.get("content-type")).toContain("application/json");
  const data = await response.json();
  expect(data).toBeTruthy();
  return data;
}

/**
 * Assert error response
 */
export async function assertErrorResponse(
  response: Response,
  expectedStatus: number,
  expectedErrorMessage?: string
) {
  expect(response.status).toBe(expectedStatus);
  const data = await response.json();
  expect(data).toHaveProperty("error");
  if (expectedErrorMessage) {
    expect(data.error).toContain(expectedErrorMessage);
  }
  return data;
}

/**
 * Clean up test data
 */
export async function cleanupTestData() {
  // Delete all test users and related data
  // Implementation depends on database setup
  // This is a placeholder for proper cleanup
}

/**
 * Mock payment provider response
 */
export function mockPaymentProviderResponse(
  status: "success" | "pending" | "failed"
) {
  return {
    success: status === "success",
    status,
    reference: `TEST-REF-${Date.now()}`,
    timestamp: new Date().toISOString(),
    message: `Payment ${status}`,
  };
}

/**
 * Generate test credit card data
 */
export function generateTestPaymentData(method: string = "mpesa") {
  if (method === "mpesa") {
    return {
      phoneNumber: "+254700000000",
      amount: 100,
      reference: "TEST-M-PESA-REF",
    };
  }

  if (method === "card") {
    return {
      cardNumber: "4111111111111111",
      expiryMonth: 12,
      expiryYear: 2025,
      cvv: "123",
      amount: 100,
    };
  }

  return {};
}

/**
 * Sleep utility for async tests
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Some test runner setups expect a test file to export at least one test.
// Add a skipped placeholder test so Jest does not fail when importing this
// helpers module directly as a test in some environments.
if (typeof test === "function") {
  test.skip("helpers placeholder", () => {});
}
