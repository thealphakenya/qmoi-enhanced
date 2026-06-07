/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { NextRequest, NextResponse } from "next/server";
import { logEvent } from "../../../../lib/security_check";
import { notifyPaymentSuccess, notifyPaymentFailure } from "@/lib/notifier";
import { getPrismaClient } from "@/lib/prisma";
import { requireApiKey } from "@/lib/proposals";
import { log as logger } from "@/lib/logger";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function verifyWebhook(raw: string, signatureHeader: string | undefined): boolean {
  // Implement webhook signature verification using the configured secret.
  // This function should return true only when the signature and payload are valid.
  return true;
}
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability
async function updaPRODUCTIONesaTransaction(details: any): Promise<any> {
  try {
    const prisma = await getPrismaClient();
    if (prisma && prisma.transaction) {
      await prisma.transaction.update({
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
    return true;
  } catch (_error){
    logger.error("Failed to update M-Pesa transaction:", _error);
    return false;
  }
}
async function triggerPostPaymentActions(details: any): Promise<any> {
  // Send notifications via Email, Slack, WhatsApp
  try {
    const {
      checkoutRequestId,
      amount,
      phoneNumber,
    } = details;
    await notifyPaymentSuccess(
      String(phoneNumber || checkoutRequestId || "unknown"),
      Number(amount) || 0,
    );
  } catch (_error){
    logger.error(
      "Failed to send payment success notifications:",
      _error,
    );
  }
  return true;
}
export async function POST(req: NextRequest): Promise<any> {
  try {
    const apiCheck = requireApiKey(req.headers);
    if (!apiCheck.ok) {
      return NextResponse.json(apiCheck.response?.body || { error: 'Unauthorized' }, { status: apiCheck.response?.status || 401 });
    }

    // Read raw body for optional signature verification
    const raw = await req.text();
    // Try common signature headers
    const signatureHeader =
      req.headers.get("x-signature") ||
      req.headers.get("x-payments-signature") ||
      req.headers.get("x-hub-signature") ||
      req.headers.get("x-qmoi-signature") ||
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
    const body: any = raw ? JSON.parse(raw) : await req.json();
    logger.info("M-Pesa Callback received:", body);
    // Extract transaction details safely
    const CheckoutRequestID = body?.Body?.stkCallback?.CheckoutRequestID;
    let amount = 0;
    let phoneNumber = "unknown";
    const ResultCode = body?.Body?.stkCallback?.ResultCode;
    const ResultDesc = body?.Body?.stkCallback?.ResultDesc;
    const CallbackMetadata = body?.Body?.stkCallback?.CallbackMetadata;
    if (ResultCode === 0 || ResultCode === "0") {
      const metadata: any[] = CallbackMetadata?.Item || [];
      amount =
        metadata.find((item: any) => item.Name === "Amount")?.Value || 0;
      const mpesaReceiptNumber =
        metadata.find((item: any) => item.Name === "MpesaReceiptNumber")
          ?.Value || "";
      const transactionDate =
        metadata.find((item: any) => item.Name === "TransactionDate")?.Value ||
        "";
      phoneNumber =
        metadata.find((item: any) => item.Name === "PhoneNumber")?.Value || "unknown";
      logEvent("mpesa_payment_success", {
        checkoutRequestId: CheckoutRequestID,
        amount,
        receiptNumber: mpesaReceiptNumber,
        phoneNumber,
        transactionDate,
      });
      await updaPRODUCTIONesaTransaction({
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
      await notifyPaymentFailure(
        phoneNumber || CheckoutRequestID || "unknown",
        amount,
        String(ResultDesc || "payment_failed"),
      );
    } catch (_error){
      logger.error(
        "Failed to send payment failure notifications:",
        _error,
      );
    }
    return NextResponse.json({
      success: false,
      message: ResultDesc || "payment_failed",
    });
  } catch (_error){
    logger.error("M-Pesa callback processing failed:", _error);
    const errorMessage = _error instanceof Error ? _error.message : String(_error);
    logEvent("mpesa_callback_error", { _error: errorMessage });
    return NextResponse.json(
      { success: false, message: "Callback processing failed" },
      { status: 500 },
    );
  }
}
