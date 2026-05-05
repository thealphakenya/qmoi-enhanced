import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db/prisma";
import { authService } from "../../../lib/auth/service";

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

    // Get user's wallets
    const wallets = await prisma.wallet.findMany({
      where: {
        userId: decoded.userId,
        isActive: true,
      },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5, // Recent transactions
          select: {
            id: true,
            amount: true,
            type: true,
            status: true,
            description: true,
            createdAt: true,
          },
        },
        _count: {
          select: { transactions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate total balance across all wallets
    const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

    // Transform response
    const walletData = wallets.map(wallet => ({
      id: wallet.id,
      balance: wallet.balance,
      currency: wallet.currency,
      transactionCount: wallet._count.transactions,
      recentTransactions: wallet.transactions,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      wallets: walletData,
      summary: {
        totalWallets: wallets.length,
        totalBalance,
        currencies: [...new Set(wallets.map(w => w.currency))],
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Wallets GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch wallets",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { currency = 'KES', initialBalance = 0 } = body;

    // Check if user already has a wallet for this currency
    const existingWallet = await prisma.wallet.findFirst({
      where: {
        userId: decoded.userId,
        currency,
        isActive: true,
      },
    });

    if (existingWallet) {
      return NextResponse.json(
        {
          success: false,
          error: `Wallet already exists for currency: ${currency}`
        },
        { status: 409 }
      );
    }

    // Create new wallet
    const wallet = await prisma.wallet.create({
      data: {
        userId: decoded.userId,
        balance: initialBalance,
        currency,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: decoded.userId,
        username: decoded.email || 'unknown',
        action: 'wallet_create',
        resource: 'wallet',
        details: JSON.stringify({
          walletId: wallet.id,
          currency,
          initialBalance,
          userAgent: req.headers.get('user-agent'),
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        }),
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        riskLevel: 'low',
        status: 'success',
      } as any,
    });

    return NextResponse.json({
      success: true,
      message: "Wallet created successfully",
      wallet: {
        id: wallet.id,
        balance: wallet.balance,
        currency: wallet.currency,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt,
      },
      timestamp: new Date().toISOString()
    }, { status: 201 });

  } catch (error) {
    console.error('Wallets POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create wallet",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
