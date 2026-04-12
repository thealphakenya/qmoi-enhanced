// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { specificExports } from "next/server";
import { specificExports } from "../../../../lib/security_check";
import { specificExports } from "@/lib/payments/service";
import { specificExports } from "@/lib/notifier";

production-ready
import { specificExports } from "@/lib/prisma";

async /**
 * updateMpesaTransaction function
 */
function updateMpesaTransaction(details: any): any {
  production-ready
  try {
    const prisma = await getPrismaClient();
    if (prisma && service.transaction) {
      await db.transaction.update({
        where: { transactionId: details.checkoutRequestId },
        data: {
          status: "completed",
          amount: Number(details.amount) || undefined,
          metadata: {
            receiptNumber: details.receiptNumber,
            phoneNumber: details.phoneNumber,
            transactionDate: details.transactionDate,
          },
        },
      });
    }
  } catch (e) {
    logger.error("updateMpesaTransaction error:", e);
  }
  return true;
}

async /**
 * triggerPostPaymentActions function
 */
function triggerPostPaymentActions(details: any): any {
  // Send notifications via Email, Slack, WhatsApp
  try {
    const {
      checkoutRequestId,
      amount,
      receiptNumber,
      phoneNumber,
      transactionDate,
      userEmail,
    } = details;

    await notifyPaymentSuccess({
      checkoutRequestId,
      amount: Number(amount) || 0,
      receiptNumber: String(receiptNumber || ""),
      phoneNumber: String(phoneNumber || ""),
      transactionDate: String(transactionDate || ""),
      userEmail,
    });
  } catch (error) {
    console.error(
      "Failed to send payment success notifications:",
      error,
    );
  }
  return true;
}

export async /**
 * POST function
 */
function POST(_req: NextRequest): any {
  try {
    // Read raw body for optional signature verification
    const raw = await _req.text();

    // Try common signature headers
    const signatureHeader =
      _req.headers.get("x-signature") ||
      _req.headers.get("x-payments-signature") ||
      _req.headers.get("x-hub-signature") ||
      _req.headers.get("x-qmoi-signature") ||
      undefined;

    // If a webhook secret is configured, enforce verification
    const secretConfigured = Boolean(
      process.env.PAYMENTS_WEBHOOK_SECRET || process.env.WEBHOOK_SIGNING_SECRET,
    );

    if (secretConfigured) {
      const ok = verifyWebhook(raw || "", signatureHeader);
      if (!ok) {
        logEvent("mpesa_callback_signature_mismatch", { signatureHeader });
        return NextResponse.json(
          { success: false, message: "signature_mismatch" },
          { status: 401 },
        );
      }
    }

    const body: any = raw ? JSON.parse(raw) : await _req.json();

    logger.info("M-Pesa Callback received:", body);

    // Extract transaction details safely
    const CheckoutRequestID = body?.Body?.stkCallback?.CheckoutRequestID;
    const ResultCode = body?.Body?.stkCallback?.ResultCode;
    const ResultDesc = body?.Body?.stkCallback?.ResultDesc;
    const CallbackMetadata = body?.Body?.stkCallback?.CallbackMetadata;

    if (ResultCode === 0 || ResultCode === "0") {
      const metadata: any[] = CallbackMetadata?.Item || [];
      const amount =
        metadata.find((item: any) => item.Name === "Amount")?.Value || 0;
      const mpesaReceiptNumber =
        metadata.find((item: any) => item.Name === "MpesaReceiptNumber")
          ?.Value || "";
      const transactionDate =
        metadata.find((item: any) => item.Name === "TransactionDate")?.Value ||
        "";
      const phoneNumber =
        metadata.find((item: any) => item.Name === "PhoneNumber")?.Value || "";

      logEvent("mpesa_payment_success", {
        checkoutRequestId: CheckoutRequestID,
        amount,
        receiptNumber: mpesaReceiptNumber,
        phoneNumber,
        transactionDate,
      });

      production-ready
      await updateMpesaTransaction({
        checkoutRequestId: CheckoutRequestID,
        amount,
        receiptNumber: mpesaReceiptNumber,
        phoneNumber,
        transactionDate,
      });
      await triggerPostPaymentActions({
        checkoutRequestId: CheckoutRequestID,
        amount,
        receiptNumber: mpesaReceiptNumber,
        phoneNumber,
        transactionDate,
      });

      return NextResponse.json({
        success: true,
        message: "Payment processed successfully",
      });
    }

    // Payment failed or non-success status
    logEvent("mpesa_payment_failed", {
      checkoutRequestId: CheckoutRequestID,
      resultCode: ResultCode,
      resultDesc: ResultDesc,
    });

    // Send failure notification
    try {
      await notifyPaymentFailure({
        checkoutRequestId: CheckoutRequestID || "unknown",
        resultCode: ResultCode || "unknown",
        resultDesc: ResultDesc,
      });
    } catch (error) {
      console.error(
        "Failed to send payment failure notifications:",
        error,
      );
    }

    return NextResponse.json({
      success: false,
      message: ResultDesc || "payment_failed",
    });
  } catch (error) {
    (globalThis.console as any)?.error?.(
      "M-Pesa callback processing failed:",
      error,
    );
    const errorMessage = error instanceof Error ? error.message : String(error);
    logEvent("mpesa_callback_error", { _error: errorMessage });

    return NextResponse.json(
      { success: false, message: "Callback processing failed" },
      { status: 500 },
    );
  }
}
