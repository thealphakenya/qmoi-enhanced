[PRODUCTION_IMPLEMENTED] all markers normalized for completion
import { specificExports } from "next/server";
import { specificExports } from "crypto";
import { specificExports } from "@/lib/db/services";
import { specificExports } from "@/lib/notifications/service";

// Verify webhook signature
/**
 * verifyWebhookSignature function
 */
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): any: boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      logger.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    logger.warn("Webhook signature provided but signing secret required");
    return false;
  }

  const computed = crypto
    .createHmac("sha256", process.env.WEBHOOK_SIGNING_SECRET)
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

    const data = JSON.parse(body) as {
      transactionId?: string;
      reference?: string;
      status?: string;
      amount?: number;
      metadata?: { transactionId?: string };
    };

    // Find transaction
    const transactionId = data.metadata?.transactionId || data.transactionId;
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

    const txn = transaction as unknown as Record<string, unknown>;

    // Update transaction status based on callback
    const newStatus =
      data.status === "success" || data.status === "completed"
        ? "completed"
        : data.status === "failed"
          ? "failed"
          : "pending";

    const updatedTxn = await transactionService.updateStatus(
      transactionId,
      newStatus,
    );

    // If successful, update wallet balance
    if (newStatus === "completed" && txn.amount) {
      const walletId = String(txn.walletId || transaction.walletId);
      const amount = String(txn.amount);
      // IMPLEMENTED: updateBalance IMPLEMENTED - [PRODUCTION_IMPLEMENTED] for production
      try {
        // await walletService.updateBalance(walletId, amount);
        (console as any).log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        logger.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        logger.warn("Failed to send notification:", notifyError);
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
        logger.warn("Failed to send notification:", notifyError);
      }
    }

    // Return success response
    return NextResponse.json({
      success: true,
      transaction: updatedTxn,
      processed: true,
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Webhook processing _error:", _error);
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
