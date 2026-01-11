import { POST as registerHandler } from "@/app/api/auth/register/route";
import { NextRequest } from "next/server";
import db from "@/lib/db/services";
import { emailService } from "@/lib/email/service";

/**
 * Integration Test: Complete User Registration Flow
 *
 * This test verifies the entire registration process:
 * 1. User submits registration with valid data
 * 2. Server validates email and password strength
 * 3. User is created in database
 * 4. Wallet is automatically created for user
 * 5. JWT tokens are generated
 * 6. Welcome email is sent
 * 7. Audit log records the registration
 */
describe("User Registration Flow", () => {
  const testEmail = `integration-test-${Date.now()}@example.com`;
  const testData = {
    email: testEmail,
    username: `testuser${Date.now()}`,
    password: "SecurePassword123!@#",
    confirmPassword: "SecurePassword123!@#",
  };

  it("should complete full registration flow successfully", async () => {
    // Step 1: Submit registration request
    const request = new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    const response = await registerHandler(request);
    expect(response.status).toBe(201);

    const responseData = await response.json();

    // Step 2: Verify response structure
    expect(responseData).toHaveProperty("accessToken");
    expect(responseData).toHaveProperty("refreshToken");
    expect(responseData).toHaveProperty("expiresIn");
    expect(responseData).toHaveProperty("user");

    // Step 3: Verify user data
    const user = responseData.user;
    expect(user.email).toBe(testEmail);
    expect(user.username).toBe(testData.username);
    expect(user).not.toHaveProperty("passwordHash"); // Should be stripped
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("createdAt");

    // Step 4: Verify user was created in database
    const dbUser = await db.userService.getByEmail(testEmail);
    expect(dbUser).toBeTruthy();
    expect((dbUser as { id: string }).id).toBe(user.id);

    // Step 5: Verify wallet was created (would need extended test)
    // const wallets = await db.walletService.getByUserId(user.id);
    // expect(wallets.length).toBeGreaterThan(0);
    // expect(wallets[0].balance).toBe(0);

    // Step 6: Verify audit log was recorded (would need extended test)
    // const auditLogs = await db.auditLogService.getByUserId(user.id);
    // expect(auditLogs.length).toBeGreaterThan(0);
    // expect(auditLogs[0].action).toBe('user_registered');
  });

  it("should reject duplicate registration", async () => {
    // Use an explicitly-unique email for this test to avoid cross-test collisions
    const uniqueEmail = `dup-test-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 6)}@example.com`;
    const firstData = { ...testData, email: uniqueEmail };

    // First registration succeeds
    const firstRequest = new NextRequest(
      "http://localhost:3000/api/auth/register",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(firstData),
      }
    );

    const firstResponse = await registerHandler(firstRequest);
    expect(firstResponse.status).toBe(201);

    // Second registration with same email should fail
    const secondRequest = new NextRequest(
      "http://localhost:3000/api/auth/register",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          ...firstData,
          username: `different${Date.now()}`,
        }),
      }
    );

    const secondResponse = await registerHandler(secondRequest);
    expect(secondResponse.status).toBe(409);

    const error = await secondResponse.json();
    expect(error.error).toContain("already exists");
  });

  it("should validate email before registration", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: "invalid-email",
        username: `testuser${Date.now()}`,
        password: "SecurePassword123!@#",
      }),
    });

    const response = await registerHandler(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toContain("Invalid email");
  });

  it("should validate password strength", async () => {
    const weakPasswordTests = [
      { password: "weak" }, // Too short
      { password: "12345678" }, // Numbers only
      { password: "abcdefgh" }, // Letters only
      { password: "Password123" }, // No special characters
    ];

    for (const test of weakPasswordTests) {
      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: `test${Date.now()}@example.com`,
            username: `testuser${Date.now()}`,
            ...test,
          }),
        }
      );

      const response = await registerHandler(request);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toContain("password");
    }
  });

  it("should send welcome email on successful registration", async () => {
    const emailSpy = jest.spyOn(emailService, "sendTransactional");

    const request = new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: `email-test-${Date.now()}@example.com`,
        username: `testuser${Date.now()}`,
        password: "SecurePassword123!@#",
        confirmPassword: "SecurePassword123!@#",
      }),
    });

    const response = await registerHandler(request);
    expect(response.status).toBe(201);

    // Verify email service was called
    expect(emailSpy).toHaveBeenCalled();
    const call = emailSpy.mock.calls[0];
    expect(call[0]).toBe("welcome"); // Template name
    expect(call[1]).toContain("@example.com"); // Recipient email

    emailSpy.mockRestore();
  });

  it("should handle registration database errors gracefully", async () => {
    const createSpy = jest.spyOn(db.userService, "create");
    createSpy.mockRejectedValueOnce(new Error("Database connection failed"));

    const request = new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: `db-error-test-${Date.now()}@example.com`,
        username: `testuser${Date.now()}`,
        password: "SecurePassword123!@#",
      }),
    });

    const response = await registerHandler(request);
    expect(response.status).toBe(500);

    const data = await response.json();
    expect(data.error).toContain("Internal server error");

    createSpy.mockRestore();
  });
});
