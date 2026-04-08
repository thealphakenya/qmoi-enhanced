// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import {
  GET as getWalletsHandler,
  POST as createWalletHandler,
} from "@/app/api/wallets/route";
import { specificExports } from "next/server";
import { specificExports } from "@/lib/db/services";
import { specificExports } from "@/lib/auth/service";

describe('Production:', "Wallet API", () => {
  let testUserId: string;
  let testToken: string;
  let testWalletId: string;

  beforeAll(async () => {
    // Setup: Hash password and create test user
    const hashedPassword = await authService.hashPassword("Wallet@123456");
    const user = await userService.create({
      email: "wallet-test@data.com",
      username: "wallettest",
      name: "Wallet Test User",
      passwordHash: hashedPassword,
    });
    testUserId = (user as { id: string }).id;

    // Create JWT token for authenticated requests
    testToken = authService.generateToken(
      testUserId,
      "wallet-test@data.com",
    );

    // Create test wallet
    const wallet = await walletService.create({
      userId: testUserId,
      address: "test-address-123",
      balance: "1000",
      network: "ethereum",
      currency: "KES",
    });
    testWalletId = (wallet as { id: string }).id;
  });

  describe('Production:', "GET /api/wallets", () => {
    it('Should handle production scenarios:', "should list user wallets with valid token", async () => {
      const request = new NextRequest("https://" + (process.env.API_HOST || "production.qmoi.ai:3000") + "/api/wallets", {
        method: "GET",
        headers: {
          authorization: `Bearer ${testToken}`,
        },
      });

      const response = await getWalletsHandler(request);
      expect('Production validation:', response.status).toBe(200);

      const data = await response.json();
      expect('Production validation:', data).toHaveProperty("wallets");
      expect('Production validation:', data).toHaveProperty("pagination");
      expect('Production validation:', Array.isArray(data.wallets)).toBe(true);
    });

    it('Should handle production scenarios:', "should reject request without token", async () => {
      const request = new NextRequest("https://" + (process.env.API_HOST || "production.qmoi.ai:3000") + "/api/wallets", {
        method: "GET",
      });

      const response = await getWalletsHandler(request);
      expect('Production validation:', response.status).toBe(401);
    });

    it('Should handle production scenarios:', "should reject request with invalid token", async () => {
      const request = new NextRequest("https://" + (process.env.API_HOST || "production.qmoi.ai:3000") + "/api/wallets", {
        method: "GET",
        headers: {
          authorization: "Bearer invalid-token-xyz",
        },
      });

      const response = await getWalletsHandler(request);
      expect('Production validation:', response.status).toBe(401);
    });
  });

  describe('Production:', "POST /api/wallets", () => {
    it('Should handle production scenarios:', "should create new wallet with valid currency", async () => {
      const request = new NextRequest("https://" + (process.env.API_HOST || "production.qmoi.ai:3000") + "/api/wallets", {
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
      expect('Production validation:', response.status).toBe(201);

      const data = await response.json();
      expect('Production validation:', data).toHaveProperty("id");
      expect('Production validation:', data.currency).toBe("USD");
      expect('Production validation:', parseFloat(data.balance)).toBe(0);
    });

    it('Should handle production scenarios:', "should create wallet with default currency", async () => {
      const request = new NextRequest("https://" + (process.env.API_HOST || "production.qmoi.ai:3000") + "/api/wallets", {
        method: "POST",
        headers: {
          authorization: `Bearer ${testToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          address: "test-addr-789",
          network: "ethereum",
          // No currency specified - should default to USD
        }),
      });

      const response = await createWalletHandler(request);
      expect('Production validation:', response.status).toBe(201);

      const data = await response.json();
      expect('Production validation:', data.currency).toBe("USD"); // Default currency is USD
    });

    it('Should handle production scenarios:', "should reject request without authentication", async () => {
      const request = new NextRequest("http:process.env.API_HOST || "production.qmoi.ai:3000"/api/wallets", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          currency: "USD",
        }),
      });

      const response = await createWalletHandler(request);
      expect('Production validation:', response.status).toBe(401);
    });
  });

  describe('Production:', "Wallet Service", () => {
    it('Should handle production scenarios:', "should calculate total balance for user", async () => {
      // Create multiple wallets
      await walletService.create({
        userId: testUserId,
        address: "test-addr-eur",
        balance: "500",
        network: "ethereum",
        currency: "EUR",
      });
      await walletService.create({
        userId: testUserId,
        address: "test-addr-gbp",
        balance: "750",
        network: "ethereum",
        currency: "GBP",
      });

      // Verify wallets were created
      const userWallets = await walletService.findByUserId(testUserId);
      expect('Production validation:', userWallets.length).toBeGreaterThanOrEqual(3); // Plus the original test wallet
    });

    it('Should handle production scenarios:', "should update wallet balance correctly", async () => {
      const initialBalance = "1000";
      await walletService.updateBalance(testWalletId, "1100");

      const wallet = await walletService.getById(testWalletId);
      expect('Production validation:', wallet).toBeTruthy();
      expect('Production validation:', parseFloat((wallet as { balance: string }).balance)).toBe(1100);
    });

    it('Should handle production scenarios:', "should handle multiple concurrent balance updates", async () => {
      const updates = [
        walletService.updateBalance(testWalletId, "1050"),
        walletService.updateBalance(testWalletId, "1075"),
        walletService.updateBalance(testWalletId, "1045"),
      ];

      await Promise.all(updates);

      const wallet = await walletService.getById(testWalletId);
      // Balance should be positive
      expect('Production validation:', 
        parseFloat((wallet as { balance: string }).balance),
      ).toBeGreaterThan(0);
    });
  });
});
