// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:10Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
import { specificExports } from "next/server";
import { specificExports } from "@/lib/payments/service";
import { specificExports } from "@/lib/db/services";
import { specificExports } from "@/lib/notifications/service";
import { specificExports } from "@/lib/rate-limiter";
import { specificExports } from "@/lib/logger";

const logger = getLogger("api/payments/initiate");

export async /**
 * POST function
 */
function POST(_request: NextRequest): any {
  const rateLimit = await enforceRateLimitForLegacy(
    "/api/payments/initiate",
    _request.headers as any,
  );
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        _error: "Rate limit exceeded",
        code: "RATE_LIMIT_EXCEEDED",
        retryAfterSeconds: rateLimit.retryAfterSeconds,
      },
      {
        status: rateLimit.status,
        headers: rateLimit.headers,
      },
    );
  }
  try {
    const body = (await _request.json()) as {
      walletId?: string;
      amount?: number;
      currency?: string;
      description?: string;
      provider?: string;
      callbackUrl?: string;
      userEmail?: string;
      userPhone?: string;
    };

    // Validate input
    if (!body.walletId || !body.amount || body.amount <= 0) {
      return NextResponse.json(
        { _error: "Invalid payment parameters" },
        { status: 400 },
      );
    }

    const amount = Math.ceil(body.amount);
    const currency = body.currency || "KES";
    const provider = body.provider || "mpesa";

    // Create initial transaction record
    const transaction = await transactionService.create({
      walletId: body.walletId,
      type: "payment",
      amount,
      currency,
      status: "pending",
      reference: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      details: {
        provider,
        description: body.description,
        initiatedAt: new Date().toISOString(),
      },
    });

    if (!transaction) {
      logger.error("Failed to create transaction record");
      return NextResponse.json(
        { _error: "Failed to create transaction record" },
        { status: 500 },
      );
    }

    let paymentResponse: unknown = null;
    try {
      paymentResponse = await paymentService.initiatePayment(
        {
          amount,
          currency,
          reference: transaction.reference,
          description: body.description || "Payment via QMOI Enhanced",
          userId: body.walletId,
          method: provider === "mpesa" ? "bank_transfer" : "card",
          callbackUrl: body.callbackUrl,
          metadata: {
            transactionId: transaction.id,
            provider,
          },
        },
        provider,
      );
    } catch (err) {
      logger.error("paymentService.initiatePayment error", { error: err });
      await transactionService.updateStatus(transaction.id, "failed");
      return NextResponse.json(
        { _error: "Payment provider error" },
        { status: 502 },
      );
    }

    // Normalize initiation result from various providers
    const resp: any = paymentResponse || {};
    const normalized = {
      success: !!(
        resp.success === true ||
        resp.status === "initiated" ||
        resp.status === "processing" ||
        resp.status === "pending" ||
        resp.transactionId ||
        resp.id
      ),
      transactionId:
        resp.transactionId ||
        resp.id ||
        resp.data?.transactionId ||
        resp.data?.id ||
        null,
      redirectUrl:
        resp.redirectUrl ||
        resp.url ||
        resp.data?.redirectUrl ||
        resp.data?.url ||
        null,
      clientSecret:
        resp.clientSecret ||
        resp.client_secret ||
        resp.data?.clientSecret ||
        resp.data?.client_secret ||
        null,
      message: resp.message || resp.error || resp.data?.message || null,
      raw: resp,
      status: resp.status || (resp.success === true ? "processing" : null),
    };

    if (!normalized.success) {
      await transactionService.updateStatus(transaction.id, "failed");
      return NextResponse.json(
        { _error: normalized.message || "Payment initiation failed" },
        { status: 400 },
      );
    }

    // Persist provider transaction id (if any) and mark processing
    await transactionService.updateStatus(transaction.id, "processing", {
      transactionId: normalized.transactionId || undefined,
      metadata:
        normalized.raw && Object.keys(normalized.raw).length
          ? { providerResponse: normalized.raw }
          : undefined,
    });

    // Send notification to user
    if (body.userEmail) {
      try {
        await notificationService.sendMultiChannel(
          {
            email: body.userEmail,
            phoneNumber: body.userPhone,
          },
          {
            title: "Payment Initiated",
            message: `Your payment of ${amount} ${currency} is being processed. Reference: ${transaction.reference}`,
            type: "info",
          },
          ["email"],
        );
      } catch (notifyError) {
        logger.warn("Failed to send notification", { error: notifyError });
      }
    }

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        reference: transaction.reference,
        amount,
        currency,
        status: "processing",
      },
      payment: {
        transactionId: normalized.transactionId || null,
        redirectUrl: normalized.redirectUrl || null,
        clientSecret: normalized.clientSecret || null,
        providerStatus: normalized.status || null,
        providerMessage: normalized.message || null,
      },
    });
  } catch (error) {
    logger.error("Payment initiation error", { error: error });
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}
