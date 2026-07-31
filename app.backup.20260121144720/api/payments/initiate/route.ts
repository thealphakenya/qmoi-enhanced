import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/payments/initiate/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payments/service";
import { transactionService, walletService } from "@/lib/db/services";
import { notificationService } from "@/lib/notifications/service";

export async function POST(_request: NextRequest) {
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

    // Initiate payment with provider
    const paymentResponse = await paymentService.initiatePayment(
      {
        amount,
        currency,
        reference: transaction.reference,
        description: body.description || "Payment via QMOI Enhanced",
        userId: body.walletId,
        callbackUrl: body.callbackUrl,
        metadata: {
          transactionId: transaction.id,
          provider,
        },
      },
      provider,
    );

    if (!paymentResponse.success) {
      // Update transaction to failed
      await transactionService.updateStatus(transaction.id, "failed");

      return NextResponse.json(
        { _error: paymentResponse.message },
        { status: 400 },
      );
    }

    // Update transaction with payment processor transaction ID
    await transactionService.updateStatus(transaction.id, "processing");

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
        console.warn("Failed to send notification:", notifyError);
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
        transactionId: paymentResponse.transactionId,
        redirectUrl: paymentResponse.redirectUrl,
      },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("Payment initiation _error:", _error);
    return NextResponse.json(
      { _error: "Payment initiation failed" },
      { status: 500 },
    );
  }
}
