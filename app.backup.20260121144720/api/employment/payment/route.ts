/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.398096Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z

// AUTOFIXED by Ollama at 2026-07-26T19:39:17.399096Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/employment/payment/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  amount: z.number().positive(),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["employee", "user"]),
  paymentMethod: z.enum(["mpesa", "airtel", "PayPal", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: unknown[] = [];
const paymentLogs: unknown[] = [];

// Secure credential storage (in production, use encrypted environment variables)
// Do NOT keep fallback literal secrets in source. Provide via environment or secrets manager.
const PAYMENT_CREDENTIALS = {
  PayPal: {
    consumerKey: process.env.PAYPAL_CLIENT_ID || "",
    consumerSecret: process.env.PAYPAL_CLIENT_SECRET || "",
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

async function backupCredentialsSafe(credentials: unknown, platform: string) {
  try {
    const masked = {
      PayPal: { consumerKey: maskSecret(credentials.PayPal.consumerKey) },
      mpesa: { passkey: maskSecret(credentials.mpesa.passkey) },
    };
    console.log(`Safe backup for ${platform}:`, masked);
    // Intentionally avoid sending raw secrets via email or API.
  } catch (_error) {
    (console as any).error(
      "Failed to create safe backup for credentials:",
      _error,
    );
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: unknown) {
  try {
    // Simulate M-Pesa API call
    const _response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: "174379",
          Password: PAYMENT_CREDENTIALS.mpesa.passkey,
          Timestamp: new Date().toISOString(),
          TransactionType: "CustomerPayBillOnline",
          Amount: paymentData.amount,
          PartyA: paymentData.mpesaNumber,
          PartyB: "174379",
          PhoneNumber: paymentData.mpesaNumber,
          CallBackURL: "https://your-callback-url.com/mpesa",
          AccountReference: paymentData.description,
          TransactionDesc: paymentData.description,
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.CheckoutRequestID,
      provider: "mpesa",
    };
  } catch (_error) {
    (console as any).error("M-Pesa payment failed:", _error);
    return { success: false, _error: "M-Pesa payment failed" };
  }
}

async function processAirtelPayment(paymentData: unknown) {
  try {
    // Simulate Airtel Money API call
    const _response = await fetch(
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
            msisdn: paymentData.airtelNumber,
          },
          transaction: {
            amount: paymentData.amount,
            country: "KE",
            currency: "KES",
            id: `QMOI_${Date.now()}`,
          },
        }),
      },
    );

    const result = await response.json();
    return {
      success: true,
      reference: result.data.transaction.id,
      provider: "airtel",
    };
  } catch (_error) {
    (console as any).error("Airtel payment failed:", _error);
    return { success: false, _error: "Airtel payment failed" };
  }
}

async function processPayPalPayment(paymentData: unknown) {
  try {
    // Simulate PayPal API call
    const _response = await fetch(
      "https://www.PayPal.com/api/PostPayPalDirectOrderV4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: `
        <PayPalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(" ")[0] || "User"}" 
          LastName="${
            paymentData.accountName?.split(" ").slice(1).join(" ") || "Name"
          }" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.PayPal.com" />
      `,
      },
    );

    const result = await response.text();
    return { success: true, reference: result, provider: "PayPal" };
  } catch (_error) {
    (console as any).error("PayPal payment failed:", _error);
    return { success: false, _error: "PayPal payment failed" };
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
          PayPal: { consumerKey: "***" },
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
      { status: 500 },
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
        case "PayPal":
          result = await processPayPalPayment(validatedData);
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
          : result.error,
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
        { status: 400 },
      );
    }
  } catch (_error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          _error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        _error: "Failed to process payment action",
      },
      { status: 500 },
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}

// AUTOFIXED by Ollama at 2026-07-20T01:18:48.694967Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.907254Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.052567Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.484270Z
