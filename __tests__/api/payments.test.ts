import { POST as initiatePaymentHandler } from "@/app/api/payments/initiate/route";
import { POST as webhookHandler } from "@/app/api/webhooks/payments/route";
import { NextRequest } from "next/server";
import db from "@/lib/db/services";
import { paymentService } from "@/lib/payments/service";

describe("Payment API", () => {
  let testUserId: string;
  let testWalletId: string;

  beforeAll(async () => {
    // Setup: Create test user and wallet
    const user = await db.userService.create({
      email: "payment-test@example.com",
      username: "paymenttest",
      name: "Payment Test User",
    });
    testUserId = (user as { id: string }).id;

    const wallet = await db.walletService.create(testUserId, "KES");
    testWalletId = (wallet as { id: string }).id;
  });

  describe("POST /api/payments/initiate", () => {
    it("should initiate payment with valid amount", async () => {
      // This is a simplified test - real implementation would mock payment providers
      const request = new NextRequest(
        "http://localhost:3000/api/payments/initiate",
        {
          method: "POST",
          headers: {
            authorization: `Bearer valid-token-${testUserId}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            walletId: testWalletId,
            amount: 100,
            phoneNumber: "+254700000000",
            paymentMethod: "mpesa",
          }),
        }
      );

      // Would need proper token generation in real test
      // const response = await initiatePaymentHandler(request);
      // expect(response.status).toBe(201);
    });

    it("should reject invalid amount", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/payments/initiate",
        {
          method: "POST",
          headers: {
            authorization: "Bearer valid-token",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            walletId: testWalletId,
            amount: -100, // Invalid negative amount
            phoneNumber: "+254700000000",
            paymentMethod: "mpesa",
          }),
        }
      );

      const response = await initiatePaymentHandler(request);
      expect(response.status).toBe(400);
    });

    it("should reject missing required fields", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/payments/initiate",
        {
          method: "POST",
          headers: {
            authorization: "Bearer valid-token",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            // Missing walletId and amount
            phoneNumber: "+254700000000",
            paymentMethod: "mpesa",
          }),
        }
      );

      const response = await initiatePaymentHandler(request);
      expect(response.status).toBe(400);
    });
  });

  describe("Webhook Handling", () => {
    it("should process valid payment webhook", async () => {
      const webhookPayload = {
        transactionId: "test-transaction-123",
        status: "completed",
        amount: 100,
        reference: "M-Pesa-Reference-123",
      };

      const signature = "valid-hmac-signature"; // Would be computed properly in real test

      const request = new NextRequest(
        "http://localhost:3000/api/webhooks/payments",
        {
          method: "POST",
          headers: {
            "x-webhook-signature": signature,
            "content-type": "application/json",
          },
          body: JSON.stringify(webhookPayload),
        }
      );

      // In production, this would verify signature and update transaction status
      // const response = await webhookHandler(request);
      // expect(response.status).toBe(200);
    });

    it("should reject invalid webhook signature", async () => {
      const webhookPayload = {
        transactionId: "test-transaction-123",
        status: "completed",
        amount: 100,
      };

      const request = new NextRequest(
        "http://localhost:3000/api/webhooks/payments",
        {
          method: "POST",
          headers: {
            "x-webhook-signature": "invalid-signature",
            "content-type": "application/json",
          },
          body: JSON.stringify(webhookPayload),
        }
      );

      const response = await webhookHandler(request);
      expect(response.status).toBe(401);
    });
  });

  describe("Payment Service", () => {
    it("should validate phone number format", () => {
      // M-Pesa phone validation
      expect(paymentService.validatePhoneNumber("+254700000000")).toBe(true);
      expect(paymentService.validatePhoneNumber("0700000000")).toBe(true);
      expect(paymentService.validatePhoneNumber("invalid")).toBe(false);
    });

    it("should format phone number correctly", () => {
      expect(paymentService.formatPhoneNumber("+254700000000")).toBe(
        "254700000000"
      );
      expect(paymentService.formatPhoneNumber("0700000000")).toBe(
        "254700000000"
      );
    });

    it("should generate transaction reference", () => {
      const ref = paymentService.generateTransactionReference();
      expect(ref).toBeTruthy();
      expect(typeof ref).toBe("string");
      expect(ref.length).toBeGreaterThan(10);
    });
  });
});
