import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { authService } from "@/lib/auth/service";
import { log } from "@/lib/logger";
import Stripe from "stripe";
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
    log.error('Payments GET error:', error);
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

    // Integrate with production payment providers.
    // Stripe is used for card payments; other payment methods may require provider integration.

    let paymentUrl = null;
    let paymentData = null;

    // Simulate payment provider integration
    if (paymentMethod === 'card') {
      // Stripe integration with production credentials
        const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

        if (!stripePublishableKey || !stripeSecretKey) {
          return NextResponse.json(
            { error: 'Stripe credentials not configured' },
            { status: 500 }
          );
        }

        // Initialize Stripe with the secret key and create a PaymentIntent
        const stripe = new Stripe(stripeSecretKey, { apiVersion: '2022-11-15' });
        // Stripe expects amount in the smallest currency unit (e.g., cents).
        const amountInMinor = Math.round((Number(amount) || 0) * 100);
        const intent = await stripe.paymentIntents.create({
          amount: amountInMinor,
          currency: String(currency).toLowerCase(),
          metadata: { paymentId: String(payment.id), reference },
          description: description || 'Payment transaction',
        });

        paymentUrl = `${process.env.FRONTEND_URL || process.env.API_URL || 'https://qmoi.ai'}/payment/${reference}`;
        paymentData = {
          clientSecret: intent.client_secret,
          publishableKey: stripePublishableKey,
          paymentIntentId: intent.id,
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
    log.error('Payments POST error:', error);
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
