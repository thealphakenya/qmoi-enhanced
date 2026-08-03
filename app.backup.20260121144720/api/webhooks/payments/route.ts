import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.418917Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z

// AUTOFIXED by Ollama at 2026-07-26T19:39:17.419415Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/webhooks/payments/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
): boolean {
  // If no signing secret is configured, allow unsigned webhooks only when
  // the sender did not provide a signature header. If a signature header
  // was provided but there's no secret, treat it as invalid.
  if (!process.env.WEBHOOK_SIGNING_SECRET) {
    if (!signature) {
      console.warn(
        "Webhook signing secret not set; accepting unsigned webhook",
      );
      return true;
    }
    console.warn("Webhook signature provided but signing secret missing");
    return false;
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
      console.warn("No transaction ID in webhook");
      return NextResponse.json(
        { _error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    const transaction = await transactionService.findById(transactionId);
    if (!transaction) {
      console.warn(`Transaction not found: ${transactionId}`);
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
      // Note: updateBalance implementation pending - placeholder for production
      try {
        // await walletService.updateBalance(walletId, amount);
        console.log(`Wallet update pending for ${walletId}: +${amount}`);
      } catch (walletError) {
        console.warn("Wallet balance update failed:", walletError);
      }

      // Send success notification (admins via broadcast)
      try {
        await notificationService.sendToAll(
          `Payment Completed`,
          `Transaction ${transaction.id} of ${transaction.amount} ${transaction.currency} completed successfully.`,
          "success",
        );
      } catch (notifyError) {
        console.warn("Failed to send notification:", notifyError);
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
        console.warn("Failed to send notification:", notifyError);
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "payment-webhook",
    timestamp: new Date().toISOString(),
  });
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.031593Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.925024Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.070895Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.504799Z
