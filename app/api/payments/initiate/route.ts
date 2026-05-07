import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { authService } from "@/lib/auth/service";
import { log } from "@/lib/logger";
import crypto from 'crypto';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // Get user from auth token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = authService.decodeToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    // Get user's payment history
    const payments = await prisma.paymentTransaction.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        type: true,
        description: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment history retrieved",
      payments,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Payments GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch payment history",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    log.info('Payment initiation requested', {
      endpoint: '/api/payments/initiate',
      method: 'POST',
      timestamp: new Date().toISOString(),
    });

    // Get user from auth token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = authService.decodeToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      amount,
      currency = 'KES',
      type = 'payment',
      description,
      paymentMethod = 'card',
      metadata = {}
    } = body;

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid amount is required" },
        { status: 400 }
      );
    }

    if (amount > 100000) { // Max payment limit
      return NextResponse.json(
        { success: false, error: "Payment amount exceeds maximum limit" },
        { status: 400 }
      );
    }

    // Generate payment reference
    const reference = `PAY_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Create payment transaction record
    const payment = await prisma.paymentTransaction.create({
      data: {
        userId: decoded.userId,
        amount,
        currency,
        type,
        status: 'pending',
        description: description || 'Payment transaction',
        reference,
        paymentMethod,
        metadata: JSON.stringify(metadata),
      },
    });

    // production_IMPLEMENTED, integrate with payment providers like:
    // - Stripe for card payments
    // - M-Pesa for mobile money
    // - PayPal for international payments

    let paymentUrl = null;
    let paymentData = null;

    // Simulate payment provider integration
    if (paymentMethod === 'card') {
      // Simulate Stripe integration
      paymentUrl = `${process.env.FRONTEND_URL || 'https://localhost:3000'}/payment/${reference}`;
      paymentData = {
        clientSecret: `cs_test_${crypto.randomBytes(16).toString('hex')}`,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_mock',
      };
    } else if (paymentMethod === 'mpesa') {
      // Simulate M-Pesa integration
      paymentData = {
        checkoutRequestId: `ws_CO_${Date.now()}`,
        responseCode: '0',
        responseDescription: 'Success. Request accepted for processing',
        customerMessage: 'Please enter your M-Pesa PIN to complete payment',
      };
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: decoded.userId,
        username: decoded.email || 'unknown',
        action: 'payment_initiate',
        resource: 'payment',
        details: JSON.stringify({
          paymentId: payment.id,
          amount,
          currency,
          paymentMethod,
          reference,
          userAgent: req.headers.get('user-agent'),
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        }),
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        riskLevel: amount > 50000 ? 'high' : amount > 10000 ? 'medium' : 'low',
        status: 'success',
      } as any,
    });

    return NextResponse.json({
      success: true,
      message: "Payment initiated successfully",
      payment: {
        id: payment.id,
        reference,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentMethod,
        description: payment.description,
        createdAt: payment.createdAt,
      },
      paymentData,
      paymentUrl,
      timestamp: new Date().toISOString()
    }, { status: 201 });

  } catch (error) {
    logger.error('Payments POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initiate payment",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
