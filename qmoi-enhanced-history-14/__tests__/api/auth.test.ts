import { POST as registerHandler } from "@/app/api/auth/register/route";
import { NextRequest } from "next/server";
import db from "@/lib/db/services";
import authService from "@/lib/auth/service";

describe("Authentication API", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user with valid data", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify({
            email: "test@example.com",
            username: "testuser",
            password: "Password123!@#",
            confirmPassword: "Password123!@#",
          }),
        },
      );

      const response = await registerHandler(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty("accessToken");
      expect(data).toHaveProperty("refreshToken");
      expect(data.user).toHaveProperty("id");
      expect(data.user.email).toBe("test@example.com");
    });

    it("should reject invalid email", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify({
            email: "invalid-email",
            username: "testuser",
            password: "Password123!@#",
          }),
        },
      );

      const response = await registerHandler(request);
      expect(response.status).toBe(400);
    });

    it("should reject weak password", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify({
            email: "test@example.com",
            username: "testuser",
            password: "weak",
          }),
        },
      );

      const response = await registerHandler(request);
      expect(response.status).toBe(400);
    });

    it("should reject duplicate email", async () => {
      // First registration
      await registerHandler(
        new NextRequest("http://localhost:3000/api/auth/register", {
          method: "POST",
          body: JSON.stringify({
            email: "duplicate@example.com",
            username: "testuser1",
            password: "Password123!@#",
          }),
        }),
      );

      // Duplicate registration
      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify({
            email: "duplicate@example.com",
            username: "testuser2",
            password: "Password123!@#",
          }),
        },
      );

      const response = await registerHandler(request);
      expect(response.status).toBe(409);
    });
  });

  describe("Auth Service", () => {
    it("should generate valid JWT token", () => {
      const token = authService.generateToken("test-id", "test@example.com");

      expect(token).toBeTruthy();
      expect(typeof token).toBe("string");

      const decoded = authService.verifyToken(token);
      expect(decoded).toBeTruthy();
      expect((decoded as any).userId).toBe("test-id");
      expect((decoded as any).email).toBe("test@example.com");
    });

    it("should reject invalid token", () => {
      const decoded = authService.verifyToken("invalid-token");
      expect(decoded).toBeNull();
    });

    it("should validate email format", () => {
      expect(authService.validateEmail("test@example.com")).toBe(true);
      expect(authService.validateEmail("invalid-email")).toBe(false);
      expect(authService.validateEmail("test@domain")).toBe(false);
    });

    it("should validate password strength", () => {
      expect(authService.validatePasswordStrength("weak")).toBe(false);
      expect(authService.validatePasswordStrength("Password123!@#")).toBe(true);
      expect(authService.validatePasswordStrength("NoSpecialChar123")).toBe(
        false,
      );
    });
  });
});
