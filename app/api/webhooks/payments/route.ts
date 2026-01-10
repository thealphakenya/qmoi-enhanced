import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null
): boolean {
  if (!signature || !process.env.WEBHOOK_SIGNING_SECRET) {
    console.warn("Webhook signature verification skipped");
    return true; // In development, allow unsigned webhooks
  }

  const computed = crypto
    .createHmac("sha256", process.env.WEBHOOK_SIGNING_SECRET)
    .update(body)
    .digest("hex");

  return computed === signature;
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.text();
    const signature = _request.headers.get("x-webhook-signature");

    // Verify signature
    if (!verifyWebhookSignature(body, signature)) {
      console.warn("Invalid webhook signature");
      return NextResponse.json({ _error: "Invalid signature" }, { status: 401 });
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 }
      );
    }

    const transaction = await transactionService.getById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
      return NextResponse.json(
        { _error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Update transaction status based on callback
    const newStatus =
      data.status === "success" || data.status === "completed"
        ? "completed"
        : data.status === "failed"
        ? "failed"
        : "pending";

    const updatedTxn = await transactionService.updateStatus(
      transactionId,
      newStatus
    );

    // If successful, update wallet balance
    if (newStatus === "completed" && transaction.amount) {
      await walletService.updateBalance(
        transaction.walletId,
        transaction.amount
      );

      // Send success notification to user
      try {
        await notificationService.notifyAdmins({
          title: "Payment Completed",
          message: `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          severity: "low",
        });
      } catch (notifyError) {
        console.warn("Failed to send admin notification:", notifyError);
      }
    }

    // If failed, notify admins
    if (newStatus === "failed") {
      try {
        await notificationService.notifyAdmins({
          title: "Payment Failed",
          message: `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} failed.`,
          severity: "high",
        });
      } catch (notifyError) {
        console.warn("Failed to send admin notification:", notifyError);
      }
    }

    // Return success _response
    return NextResponse.json({
      success: true,
      transaction: updatedTxn,
      processed: true,
    });
  } catch (_error) {
    console._error("Webhook processing _error:", _error);
    return NextResponse.json(
      { _error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}
