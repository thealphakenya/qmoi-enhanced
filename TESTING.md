# Testing Guide

## Overview

QMOI Enhanced uses Jest for unit and integration testing. This guide covers how to run, write, and maintain tests.

## Running Tests

### All Tests

```bash
npm test
```

### Specific Test File

```bash
npm test -- __tests__/api/auth.test.ts
```

### Watch Mode

```bash
npm test -- --watch
```

### Coverage Report

```bash
npm test -- --coverage
```

### Specific Test Suite

```bash
npm test -- --testNamePattern="User Registration"
```

## Test Structure

### Test Files Location

```
__tests__/
├── api/
│   ├── auth.test.ts
│   ├── payments.test.ts
│   └── wallets.test.ts
├── integration/
│   └── user-registration.test.ts
└── utils/
    └── test-helpers.ts
```

## Unit Tests

### API Tests

#### Authentication Tests (`__tests__/api/auth.test.ts`)

Tests JWT token generation, verification, and validation:

```bash
npm test -- __tests__/api/auth.test.ts
```

**Test Cases:**

- ✓ JWT token generation
- ✓ JWT token verification
- ✓ Email validation
- ✓ Password validation
- ✓ Expired token detection
- ✓ Invalid token rejection

#### Payment Tests (`__tests__/api/payments.test.ts`)

Tests payment initiation and webhook handling:

```bash
npm test -- __tests__/api/payments.test.ts
```

**Test Cases:**

- ✓ Payment initiation
- ✓ M-Pesa payment processing
- ✓ Pesapal payment processing
- ✓ Stripe payment processing
- ✓ Webhook signature verification
- ✓ Transaction status updates
- ✓ Phone number validation

#### Wallet Tests (`__tests__/api/wallets.test.ts`)

Tests wallet CRUD operations:

```bash
npm test -- __tests__/api/wallets.test.ts
```

**Test Cases:**

- ✓ Create wallet
- ✓ Get wallet details
- ✓ Update wallet
- ✓ Delete wallet
- ✓ List wallets with pagination
- ✓ Balance updates
- ✓ Prevent deletion of non-empty wallets
- ✓ Concurrent operations

## Integration Tests

### User Registration Flow (`__tests__/integration/user-registration.test.ts`)

Tests complete registration workflow:

```bash
npm test -- __tests__/integration/user-registration.test.ts
```

**Test Cases:**

- ✓ User registration with valid data
- ✓ Email already exists validation
- ✓ Password requirements enforcement
- ✓ JWT token generation
- ✓ User profile creation
- ✓ Wallet creation for new user
- ✓ Email verification (if enabled)
- ✓ Profile retrieval after registration
- ✓ Authentication required for protected endpoints

## Test Helpers

### Using Test Utilities (`__tests__/utils/test-helpers.ts`)

The test helpers library provides:

```typescript
// Create mock requests
const mockRequest = createMockRequest({
  method: "POST",
  headers: { Authorization: "Bearer token" },
  body: { email: "test@example.com" },
});

// Generate test data
const testUser = generateTestUser();
const testWallet = generateTestWallet(testUser.id);

// Create mock services
const mockAuthService = createMockAuthService();
const mockEmailService = createMockEmailService();

// Assert responses
expectSuccess(response, 200);
expectError(response, 400, "Invalid request");
```

## Writing New Tests

### Template for API Test

```typescript
import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { POST } from "@/app/api/example/route";
import { createMockRequest } from "@/__tests__/utils/test-helpers";

describe("Example Endpoint", () => {
  let mockRequest: any;

  beforeEach(() => {
    mockRequest = createMockRequest({
      method: "POST",
      headers: {
        Authorization: "Bearer test-token",
        "Content-Type": "application/json",
      },
    });
  });

  afterEach(() => {
    // Cleanup
  });

  it("should handle successful request", async () => {
    const response = await POST(mockRequest);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("success", true);
  });

  it("should reject unauthorized requests", async () => {
    const unauthorizedRequest = createMockRequest({
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(unauthorizedRequest);
    expect(response.status).toBe(401);
  });

  it("should validate input data", async () => {
    mockRequest.body = {
      /* invalid data */
    };
    const response = await POST(mockRequest);
    expect(response.status).toBe(400);
  });
});
```

### Template for Integration Test

```typescript
import { describe, it, expect } from "@jest/globals";
import { register } from "@/lib/auth/service";
import { getUserProfile } from "@/lib/db/services";

describe("User Registration Flow", () => {
  it("should complete registration and create profile", async () => {
    // Step 1: Register user
    const user = await register(
      "test@example.com",
      "testuser",
      "SecurePassword123!@#",
    );

    expect(user).toHaveProperty("id");
    expect(user.email).toBe("test@example.com");

    // Step 2: Verify profile created
    const profile = await getUserProfile(user.id);
    expect(profile).toBeDefined();
    expect(profile?.userId).toBe(user.id);

    // Step 3: Verify can login
    const token = generateJWT(user.id);
    expect(token).toBeDefined();
  });
});
```

## Coverage Requirements

### Minimum Coverage Thresholds

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### View Coverage Report

```bash
npm test -- --coverage
```

### Coverage Report Output

```
------------|----------|----------|----------|----------|----------|
File        |  % Stmts | % Branch | % Funcs  | % Lines  | Uncovered |
------------|----------|----------|----------|----------|----------|
All files   |   75.23  |   70.14  |   78.91  |   74.89  |           |
------------|----------|----------|----------|----------|----------|
```

## Testing Best Practices

### 1. Arrange-Act-Assert Pattern

```typescript
it("should update user profile", async () => {
  // Arrange
  const user = createTestUser();
  const updateData = { firstName: "John" };

  // Act
  const result = await updateUserProfile(user.id, updateData);

  // Assert
  expect(result.firstName).toBe("John");
});
```

### 2. Use Descriptive Test Names

```typescript
// ❌ Bad
it("works", () => {});

// ✓ Good
it("should update user firstName and return updated profile", () => {});
```

### 3. Keep Tests Focused

```typescript
// ❌ Testing multiple things
it("should register and create wallet and send email", () => {});

// ✓ Single responsibility
it("should register user with valid credentials", () => {});
it("should create default wallet on registration", () => {});
it("should send verification email on registration", () => {});
```

### 4. Mock External Dependencies

```typescript
// Mock payment provider
jest.mock("@/lib/payments/service", () => ({
  initiatePayment: jest.fn().mockResolvedValue({
    transactionId: "test-123",
    status: "pending",
  }),
}));
```

### 5. Test Error Scenarios

```typescript
it("should reject invalid email format", async () => {
  const result = register("invalid-email", "user", "password");
  await expect(result).rejects.toThrow("Invalid email");
});
```

## Debugging Tests

### Run Single Test

```bash
npm test -- -t "should update user profile"
```

### Run Tests in Debug Mode

```bash
node --inspect-brk ./node_modules/.bin/jest --runInBand
```

### Add Breakpoints

```typescript
it("should handle payment", async () => {
  debugger; // Breakpoint here
  const payment = await processPayment(1000);
  expect(payment.status).toBe("success");
});
```

### View Test Output

```bash
npm test -- --verbose
```

## Continuous Integration

Tests run automatically on:

- **Pull Requests**: All tests must pass
- **Commits to main**: All tests must pass
- **Daily Schedule**: Full test suite + coverage check

### GitHub Actions Workflow

See `.github/workflows/ci-cd.yml` for CI configuration.

## E2E Testing (Future)

Plan to add Playwright/Cypress for end-to-end testing:

```bash
# Install Playwright
npm install -D @playwright/test

# Run E2E tests
npm run test:e2e
```

Example E2E test:

```typescript
import { test, expect } from "@playwright/test";

test("user can register and login", async ({ page }) => {
  // Navigate to register page
  await page.goto("/register");

  // Fill registration form
  await page.fill('input[name="email"]', "test@example.com");
  await page.fill('input[name="password"]', "SecurePassword123!@#");
  await page.fill('input[name="confirmPassword"]', "SecurePassword123!@#");

  // Submit form
  await page.click('button[type="submit"]');

  // Verify redirect to dashboard
  await expect(page).toHaveURL("/dashboard");
});
```

## Performance Testing

Monitor test execution time:

```bash
npm test -- --detectOpenHandles
```

Optimize slow tests by:

1. Reducing database calls
2. Mocking external services
3. Using in-memory databases for tests

## Troubleshooting

### Tests Fail Locally but Pass in CI

- Clear node_modules: `rm -rf node_modules && npm install`
- Reset database: `npx prisma migrate reset`
- Check Node version: `node --version` (should match .nvmrc)

### Database Connection Errors

```bash
# Use test database
export DATABASE_URL="file:./test.db"
npx prisma migrate deploy
npm test
```

### Tests Timeout

Increase timeout:

```typescript
it("slow test", async () => {
  // test code
}, 10000); // 10 second timeout
```

### Mock Not Working

```typescript
// Clear all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
```

## Support

For testing questions:

- Review test examples in `__tests__/`
- Check Jest documentation: https://jestjs.io
- Ask in GitHub discussions
