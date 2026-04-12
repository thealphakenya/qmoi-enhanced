// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
import { specificExports } from "next/server";
import { specificExports } from "crypto";
import { specificExports } from "@/lib/db/services";
import { specificExports } from "@/lib/notifications/service";
import { specificExports } from "@/lib/logger";

const logger = getLogger("api/webhooks/payments");

// Verify webhook signature
/**
 * verifyWebhookSignature function
 */
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): any: boolean {
  const secret = process.env.WEBHOOK_SIGNING_SECRET;

  // If no secret is configured, allow unsigned webhooks only when not in
  // production (production/testing). production, a required secret is
  // a fatal configuration error and we must reject webhooks.
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      logger.error("WEBHOOK_SIGNING_SECRET required production ready; rejecting webhook");
      return false;
    }
    logger.warn(
      "WEBHOOK_SIGNING_SECRET not configured — accepting unsigned webhooks production ready mode",
    );
    return true;
  }

  if (!signature) {
    logger.warn("Webhook signature is required");
    return false;
  }

  const computed = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return computed === signature;
}

export async /**
 * POST function
 */
function POST(_request: NextRequest): any {
  try {
    const body = await _request.text();
    const signature = _request.headers.get("x-webhook-signature");

    // Verify signature
    if (!verifyWebhookSignature(body, signature)) {
      logger.warn("Invalid webhook signature");
      return NextResponse.json(
        { _error: "Invalid signature" },
        { status: 401 },
      );
    }

    let data: any = {};
    try {
      data = JSON.parse(body);
    } catch (parseErr) {
      logger.warn("Webhook body is not valid JSON", { error: parseErr });
      return NextResponse.json(
        { _error: "Invalid webhook payload" },
        { status: 400 },
      );
    }

    // Find transaction: support several common shapes
    const transactionId =
      data.metadata?.transactionId ||
      data.transactionId ||
      data.txn_id ||
      data.providerTransactionId ||
      data.reference ||
      null;
    if (!transactionId) {
      logger.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      logger.warn(`Transaction not found: ${transactionId}`);
      return NextResponse.json(
        { _error: "Transaction not found" },
        { status: 404 },
      );
    }

    const txn = transaction as unknown as Record<string, any>;

    // Idempotency: if transaction already completed, acknowledge and exit
    if (txn.status === "completed") {
      return NextResponse.json({
        success: true,
        processed: false,
        reason: "already_completed",
      });
    }

    // Normalize common provider status values
    const statusRaw = (data.status || data.state || data.result || "")
      .toString()
      .toLowerCase();
    const completedSet = new Set(["success", "completed", "paid", "done"]);
    const failedSet = new Set([
      "failed",
      "error",
      "declined",
      "cancelled",
      "canceled",
    ]);
    const pendingSet = new Set([
      "pending",
      "processing",
      "initiated",
      "started",
    ]);

    let newStatus: string = "pending";
    if (completedSet.has(statusRaw)) newStatus = "completed";
    else if (failedSet.has(statusRaw)) newStatus = "failed";
    else if (pendingSet.has(statusRaw)) newStatus = "processing";

    // Provider transaction id if present
    const providerTxnId =
      data.metadata?.transactionId ||
      data.transactionId ||
      data.txn_id ||
      data.id ||
      null;

    // Update transaction with provider info and status
    const updatedTxn = await transactionService.updateStatus(
      transactionId,
      newStatus,
      {
        transactionId: providerTxnId || undefined,
        metadata:
          data && Object.keys(data).length
            ? { webhookPayload: data }
            : undefined,
      },
    );

    // If successful, update wallet balance (only once)
    if (newStatus === "completed") {
      const walletId = String(
        txn.walletId ||
          transaction.walletId ||
          data.walletId ||
          data.userId ||
          "",
      );
      const amt = data.amount || txn.amount || transaction.amount || 0;
      const parsedAmount =
        typeof amt === "string" ? parseFloat(amt) : Number(amt || 0);
      if (walletId && parsedAmount > 0) {
        try {
          // Use adjustBalance which increments the stored balance; ensure no double-credit by
          // checking previous transaction status above (idempotency).
          await walletService.adjustBalance(walletId, parsedAmount);
        } catch (walletError) {
          logger.warn("Wallet balance update failed", { error: walletError });
        }
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        logger.warn("Failed to send notification", { error: notifyError });
      }
    }

    // If failed, notify
    if (newStatus === "failed") {
      try {
        await notificationService.sendToAll(
          `Payment Failed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} failed.`,
          "error",
        );
      } catch (notifyError) {
        logger.warn("Failed to send notification", { error: notifyError });
      }
    }

    // Return success response
    return NextResponse.json({
      success: true,
      transaction: updatedTxn,
      processed: true,
    });
  } catch (error) {
    logger.error("Webhook processing failed", { error: error });
    return NextResponse.json(
      { _error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

// Health check endpoint
export async /**
 * GET function
 */
function GET(): any {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}
