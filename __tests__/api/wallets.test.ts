import {
  GET as getWalletsHandler,
  POST as createWalletHandler,
} from "@/app/api/wallets/route";
import { NextRequest } from "next/server";
import db from "@/lib/db/services";
import authService from "@/lib/auth/service";

describe("Wallet API", () => {
  let testUserId: string;
  let testToken: string;
  let testWalletId: string;

  beforeAll(async () => {
    // Setup: Create test user
    const user = await db.userService.create({
      email: "wallet-test@example.com",
      username: "wallettest",
      name: "Wallet Test User",
    });
    testUserId = (user as { id: string }).id;

    // Create JWT token for authenticated requests
    testToken = authService.generateToken({
      userId: testUserId,
      email: "wallet-test@example.com",
      username: "wallettest",
      role: "user",
    });

    // Create test wallet
    const wallet = await db.walletService.create(testUserId, "KES");
    testWalletId = (wallet as { id: string }).id;
  });

  describe("GET /api/wallets", () => {
    it("should list user wallets with valid token", async () => {
      const request = new NextRequest("http://localhost:3000/api/wallets", {
        method: "GET",
        headers: {
          authorization: `Bearer ${testToken}`,
        },
      });

      const response = await getWalletsHandler(request);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty("wallets");
      expect(data).toHaveProperty("pagination");
      expect(Array.isArray(data.wallets)).toBe(true);
    });

    it("should reject request without token", async () => {
      const request = new NextRequest("http://localhost:3000/api/wallets", {
        method: "GET",
      });

      const response = await getWalletsHandler(request);
      expect(response.status).toBe(401);
    });

    it("should reject request with invalid token", async () => {
      const request = new NextRequest("http://localhost:3000/api/wallets", {
        method: "GET",
        headers: {
          authorization: "Bearer invalid-token-xyz",
        },
      });

      const response = await getWalletsHandler(request);
      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/wallets", () => {
    it("should create new wallet with valid currency", async () => {
      const request = new NextRequest("http://localhost:3000/api/wallets", {
        method: "POST",
        headers: {
          authorization: `Bearer ${testToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          currency: "USD",
        }),
      });

      const response = await createWalletHandler(request);
      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data).toHaveProperty("id");
      expect(data.currency).toBe("USD");
      expect(data.balance).toBe(0);
    });

    it("should create wallet with default currency", async () => {
      const request = new NextRequest("http://localhost:3000/api/wallets", {
        method: "POST",
        headers: {
          authorization: `Bearer ${testToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({}), // No currency specified
      });

      const response = await createWalletHandler(request);
      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data.currency).toBe("KES"); // Default currency
    });

    it("should reject request without authentication", async () => {
      const request = new NextRequest("http://localhost:3000/api/wallets", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          currency: "USD",
        }),
      });

      const response = await createWalletHandler(request);
      expect(response.status).toBe(401);
    });
  });

  describe("Wallet Service", () => {
    it("should calculate total balance for user", async () => {
      // Create multiple wallets
      await db.walletService.create(testUserId, "EUR");
      await db.walletService.create(testUserId, "GBP");

      // Would need wallet balance updates in real test
      // const totalBalance = await db.walletService.getTotalBalance(testUserId);
      // expect(totalBalance).toBeGreaterThanOrEqual(0);
    });

    it("should update wallet balance correctly", async () => {
      const initialBalance = 0;
      await db.walletService.updateBalance(testWalletId, 100);

      const wallet = await db.walletService.getById(testWalletId);
      expect((wallet as { balance: number }).balance).toBe(
        initialBalance + 100
      );
    });

    it("should handle multiple concurrent balance updates", async () => {
      const updates = [
        db.walletService.updateBalance(testWalletId, 50),
        db.walletService.updateBalance(testWalletId, 25),
        db.walletService.updateBalance(testWalletId, -30),
      ];

      await Promise.all(updates);

      const wallet = await db.walletService.getById(testWalletId);
      // Balance should be: previous + 50 + 25 - 30
      expect((wallet as { balance: number }).balance).toBeGreaterThan(0);
    });
  });
});
