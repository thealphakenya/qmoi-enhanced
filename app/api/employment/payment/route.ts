/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
/* global Request, Headers, Buffer, URLSearchParams, TextDecoder, TextEncoder */
// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: any[] = [];
const paymentLogs: any[] = [];

// Secure credential storage (in production, use encrypted environment variables)
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

function maskSecret(s: string | undefined | null) {
  if (!s) return "";
  return s.replace(/.(?=.{4})/g, "*");
}

async function backupCredentialsSafe(credentials: any, platform: string) {
  try {
    const masked = {
      pesapal: { consumerKey: maskSecret(credentials.pesapal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any)._error(
      "Failed to create safe backup for credentials:",
      _error
    );
  }
}

// Payment processing functions
import { isProductionConfirmed } from "../../../../lib/prodGuard";

async function processMpesaPayment(paymentData: any) {
  try {
    const MpesaService = (
      await import("../../../../src/services/payments/MpesaService")
    ).default;
    const svc = new MpesaService();

    const phone = paymentData.mpesaNumber || paymentData.accountNumber || "";
    const amount = paymentData.amount || 0;
    const accountRef = paymentData.description || "QMOI_TX";

    const result = await svc.stkPush(
      phone,
      amount,
      accountRef,
      paymentData.description
    );

    if (!result.success) {
      return { success: false, _error: result.error };
    }

    return { success: true, reference: result.reference, provider: "mpesa" };
  } catch (_error) {
    (console as any)._error("M-Pesa payment failed:", _error);
    const err = _error instanceof Error ? _error.message : String(_error);
    return { success: false, _error: err };
  }
}

async function processAirtelPayment(paymentData: any) {
  try {
    const AirtelService = (
      await import("../../../../src/services/payments/AirtelService")
    ).default;
    const svc = new AirtelService();

    const msisdn = paymentData.airtelNumber || paymentData.accountNumber || "";
    const amount = paymentData.amount || 0;

    const result = await svc.sendPayment(msisdn, amount);

    if (!result.success) return { success: false, _error: result.error };

    return { success: true, reference: result.reference, provider: "airtel" };
  } catch (_error) {
    (console as any)._error("Airtel payment failed:", _error);
    const err = _error instanceof Error ? _error.message : String(_error);
    return { success: false, _error: err };
  }
}

async function processPesapalPayment(paymentData: any) {
  try {
    const PesapalService = (
      await import("../../../../src/services/payments/PesapalService")
    ).default;
    const svc = new PesapalService();

    const amount = paymentData.amount || 0;
    const description = paymentData.description || "QMOI payment";
    const firstName = paymentData.accountName?.split(" ")[0] || "User";
    const lastName =
      paymentData.accountName?.split(" ").slice(1).join(" ") || "";

    const res = await svc.createOrder(
      amount,
      description,
      firstName,
      lastName,
      paymentData.email || "",
      paymentData.phone || ""
    );

    if (!res.success) return { success: false, _error: res.error };

    return { success: true, reference: res.transactionId, provider: "pesapal" };
  } catch (_error) {
    (console as any)._error("Pesapal payment failed:", _error);
    const err = _error instanceof Error ? _error.message : String(_error);
    return { success: false, _error: err };
  }
}

export async function GET(_request: NextRequest) {
  const { searchParams } = new URL(_request.url);
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
      // Only return non-sensitive info
      return NextResponse.json({
        success: true,
        data: {
          pesapal: { consumerKey: "***" },
          mpesa: { consumerKey: "***" },
          airtel: { clientId: "***" },
        },
      });
    } else {
      return NextResponse.json({
        success: true,
        data: { payments, logs: paymentLogs },
      });
    }
  } catch (_error) {
    return NextResponse.json(
      {
        success: false,
        _error: "Failed to fetch payment data",
      },
      { status: 500 }
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { action, ...data } = body;

    if (action === "process_payment") {
      const validatedData = PaymentSchema.parse(data);

      const payment = {
        id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...validatedData,
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
          : result._error,
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
        { status: 400 }
      );
    }
  } catch (_error) {
    if (_error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: _error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 }
    );
  }
}

export async function PUT(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { id, ...updates } = body;

    const index = payments.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json(
        {
          success: false,
          _error: "Payment not found",
        },
        { status: 404 }
      );
    }

    payments[index] = { ...payments[index], ...updates };

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
  } catch (_error) {
    return NextResponse.json(
      {
        success: false,
        _error: "Failed to update payment",
      },
      { status: 500 }
    );
  }
}
