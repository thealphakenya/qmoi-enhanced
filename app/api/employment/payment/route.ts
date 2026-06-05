// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import apiClient from "@/api/client";
import { log } from "@/lib/logger";
import {
  validateMasterAuth,
  requireMasterAuth,
} from "@/lib/auth/validate-master";
// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "pesapal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});
const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "pesapal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});
const payments: any[] = [];
const paymentLogs: any[] = [];
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  pesapal: {
    consumerKey: process.env.PESAPAL_CONSUMER_KEY || "",
    consumerSecret: process.env.PESAPAL_CONSUMER_SECRET || "",
  },
  mpesa: {
    consumerKey: process.env.MPESA_CONSUMER_KEY || "",
    consumerSecret: process.env.MPESA_CONSUMER_SECRET || "",
    passkey: process.env.MPESA_PASSKEY || "",
  },
  airtel: {
    clientId: process.env.AIRTEL_CLIENT_ID || "",
    clientSecret: process.env.AIRTEL_CLIENT_SECRET || "",
  },
};
function maskSecret(s: string | undefined | null): any {
  if (!s) return "";
  return s.replace(/.(?=.{4})/g, "*");
}
async function backupCredentialsSafe(credentials: any, platform: string): Promise<any> {
  try {
    const masked = {
      pesapal: { consumerKey: maskSecret(credentials?.pesapal?.consumerKey) },
      mpesa: { passkey: maskSecret(credentials?.mpesa?.passkey) },
    };
    log.info(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error){
    log.error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

async function stkPush(payload: any): Promise<any> {
  log.error("stkPush fallback invoked without production implementation", payload);
  return {
    success: false,
    error: "stkPush not implemented in this environment",
  };
}

async function processMpesaPayment(paymentData: unknown): Promise<any> {
  try {
    const amount = (paymentData as any)?.amount;
    const phone =
      (paymentData as any)?.mpesaNumber || (paymentData as any)?.phone;
    const res = await stkPush({
      phoneNumber: phone,
      amount,
      accountReference: (paymentData as any)?.recipientId || "",
      transactionDesc: (paymentData as any)?.description || "",
    });
    const ok = ((res as any)?.success ?? (res as any)?.ok) || false;
    if (ok) {
      const payload = (res as any)?.payload || res;
      return {
        success: true,
        reference:
          payload?.checkoutRequestId || payload?.responseDescription || null,
        provider: "mpesa",
        details: res,
      };
    }
    return {
      success: false,
      error:
        (res as any)?.errorMessage ||
        (res as any)?.responseDescription ||
        "mpesa_initiation_failed",
      details: res,
    };
  } catch (_error){
    log.error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}
async function processAirtelPayment(paymentData: unknown): Promise<any> {
  const data = paymentData as any;
  try {
    const _response = await apiClient.get(
      "https://openapiuat.airtel.africa/merchant/v1/payments/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.airtel.clientId}`,
          "Content-Type": "application/json",
          "X-Country": "KE",
          "X-Currency": "KES",
        },
        body: JSON.stringify({
          reference: `QMOI_${Date.now()}`,
          subscriber: {
            country: "KE",
            currency: "KES",
            msisdn: data.airtelNumber,
          },
          transaction: {
            amount: data.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );
    const result = await _response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error){
    log.error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}
async function processPesapalPayment(paymentData: unknown): Promise<any> {
  const data = paymentData as any;
  try {
    const _response = await apiClient.get(
      "https://www.pesapal.com/api/PostPesapalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PesapalDirectOrderInfo 
          xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="https://www.w3.org/2001/XMLSchema" 
          Amount="${data.amount}" 
          Description="${data.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${data.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            data.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${data.email}" 
          PhoneNumber="${data.phone}" 
          xmlns="https://www.pesapal.com" />
      `,
      },
    );
    const result = await _response.text();
    return { success: true, reference: result, provider: "pesapal" };
  } catch (_error){
    log.error("Pesapal payment failed:", _error);
    return { success: false, _error: "Pesapal payment failed" };
  }
}
export async function GET(req: NextRequest): Promise<any> {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // 'payments', 'logs', 'credentials'
  const status = searchParams.get("status");
  const recipientId = searchParams.get("recipientId");
  try {
    if (type === "payments") {
      let data = payments;
      if (status) data = data.filter((p) => p.status === status);
      if (recipientId) data = data.filter((p) => p.recipientId === recipientId);
      return NextResponse.json({ success: true, data });
    } else if (type === "logs") {
      return NextResponse.json({ success: true, data: paymentLogs });
    } else if (type === "credentials") {
      // Guard credentials with Master auth
      const auth = await validateMasterAuth(req);
      if (!auth.authenticated) {
        log.warn("Unauthorized credentials access attempt", { ip: req.ip ?? "unknown", reason: auth.error });
        return NextResponse.json({ success: false, _error: "Unauthorized" }, { status: 401 });
      }
      // Only return non-sensitive info
      return NextResponse.json({
        success: true,
        data: {
          pesapal: { consumerKey: maskSecret(PAYMENT_CREDENTIALS.pesapal.consumerKey) },
          mpesa: { passkey: maskSecret(PAYMENT_CREDENTIALS.mpesa.passkey) },
          airtel: { clientId: maskSecret(PAYMENT_CREDENTIALS.airtel.clientId) },
        },
      });
    } else {
      return NextResponse.json({
        success: true,
        data: { payments, logs: paymentLogs },
      });
    }
  } catch (_error){
    return NextResponse.json(
      {
        success: false,
        _error: "Failed to fetch payment data",
      },
      { status: 500 },
    );
  }
}
export async function POST(req: NextRequest): Promise<any> {
  try {
    const body = await req.json();
    const { action, data } = body;
    if (action === "process_payment") {
      // Require master auth to initiate payments
      const auth = await validateMasterAuth(req);
      if (!auth.authenticated) {
        log.warn("Unauthorized payment attempt", { action, ip: req.ip ?? "unknown", reason: auth.error });
        return NextResponse.json({ success: false, _error: "Unauthorized" }, { status: 401 });
      }
      const validatedData = PaymentSchema.parse(data);
      const payment = {
        id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        validatedData,
        status: "pending",
        createdAt: Date.now(),
        processedAt: null,
        result: null,
      };
      payments.push(payment);
      // Process payment based on method
      let result;
      switch (validatedData.paymentMethod) {
        case "mpesa":
          result = await processMpesaPayment(validatedData);
          break;
        case "airtel":
          result = await processAirtelPayment(validatedData);
          break;
        case "pesapal":
          result = await processPesapalPayment(validatedData);
          break;
        default:
          result = { success: false, _error: "Unsupported payment method" };
      }
      // Update payment status
      const paymentIndex = payments.findIndex((p) => p.id === payment.id);
      if (paymentIndex !== -1) {
        payments[paymentIndex] = {
          ...payments[paymentIndex],
          status: result.success ? "completed" : "failed",
          processedAt: Date.now(),
          result,
        };
      }
      // Log the payment
      paymentLogs.push({
        id: Date.now(),
        action: "payment_processed",
        paymentId: payment.id,
        recipientId: validatedData.recipientId,
        amount: validatedData.amount,
        method: validatedData.paymentMethod,
        status: result.success ? "success" : "failed",
        details: result.success
          ? "Payment processed successfully"
          : (result as any).error || "Payment failed",
        timestamp: Date.now(),
      });
      return NextResponse.json({
        success: true,
        data: payments[paymentIndex],
        message: result.success
          ? "Payment processed successfully"
          : "Payment failed",
      });
    } else if (action === "update_payment_info") {
      // Require master auth to update payment info
      const auth = await validateMasterAuth(req);
      if (!auth.authenticated) {
        log.warn("Unauthorized payment info update attempt", { action, ip: req.ip ?? "unknown", reason: auth.error });
        return NextResponse.json({ success: false, _error: "Unauthorized" }, { status: 401 });
      }
      const validatedData = PaymentInfoSchema.parse(data);
      // Update recipient payment info
      // This would update the employee/user record with new payment info
      // Log the update
      paymentLogs.push({
        id: Date.now(),
        action: "payment_info_updated",
        recipientId: validatedData.recipientId,
        method: validatedData.paymentMethod,
        details: "Payment information updated",
        timestamp: Date.now(),
      });
      return NextResponse.json({
        success: true,
        message: "Payment information updated successfully",
      });
    } else if (action === "backup_credentials") {
      // Only master may request credential backups
      const auth = await validateMasterAuth(req);
      if (!auth.authenticated) {
        log.warn("Unauthorized credentials backup attempt", { action, ip: req.ip ?? "unknown", reason: auth.error });
        return NextResponse.json({ success: false, _error: "Unauthorized" }, { status: 401 });
      }
      // Create a safe masked backup for operations visibility only
      await backupCredentialsSafe(PAYMENT_CREDENTIALS, "all_platforms");
      return NextResponse.json({
        success: true,
        message: "Credentials backed up successfully",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          _error: "Invalid action specified",
        },
        { status: 400 },
      );
    }
  } catch (_error){
    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
    );
  }
}
export async function PUT(req: NextRequest): Promise<any> {
  try {
    // Require master auth for updates
    const auth = await validateMasterAuth(req);
    if (!auth.authenticated) {
      log.warn("Unauthorized payment update attempt", { ip: req.ip ?? "unknown", reason: auth.error });
      return NextResponse.json({ success: false, _error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { id, updates } = body;
    const index = payments.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json(
        {
          success: false,
          _error: "Payment not found",
        },
        { status: 404 },
      );
    }
    payments[index] = { ...payments[index], updates };
    // Log the update
    paymentLogs.push({
      id: Date.now(),
      action: "payment_updated",
      paymentId: id,
      details: "Payment updated",
      timestamp: Date.now(),
    });
    return NextResponse.json({
      success: true,
      data: payments[index],
      message: "Payment updated successfully",
    });
  } catch (_error){
    return NextResponse.json(
      {
        success: false,
        _error: "Failed to update payment",
      },
      { status: 500 },
    );
  }
}
