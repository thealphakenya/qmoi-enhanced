import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db/prisma";
import { authService } from "@/app/lib/auth/service";
import { log as logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest, { params }: { params: { walletId: string } }) {
  try {
    const { walletId } = params;

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

    // Get wallet with ownership verification
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: walletId,
        userId: decoded.userId,
        isActive: true,
      },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          select: {
            id: true,
            amount: true,
            type: true,
            status: true,
            description: true,
            reference: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        _count: {
          select: { transactions: true },
        },
      },
    });

    if (!wallet) {
      return NextResponse.json(
        { success: false, error: "Wallet not found" },
        { status: 404 }
      );
    }

    // Get wallet statistics
    const stats = await getWalletStats(walletId);

    return NextResponse.json({
      success: true,
      wallet: {
        id: wallet.id,
        balance: wallet.balance,
        currency: wallet.currency,
        isActive: wallet.isActive,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt,
      },
      transactions: wallet.transactions,
      stats: {
        totalTransactions: wallet._count.transactions,
        ...stats,
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Wallet GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch wallet",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: { params: { walletId: string } }) {
  try {
    const { walletId } = params;

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
    const { action, amount, description, reference } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Action is required" },
        { status: 400 }
      );
    }

    // Get wallet with ownership verification
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: walletId,
        userId: decoded.userId,
        isActive: true,
      },
    });

    if (!wallet) {
      return NextResponse.json(
        { success: false, error: "Wallet not found" },
        { status: 404 }
      );
    }

    let result;
    let newBalance = wallet.balance;

    switch (action) {
      case 'deposit':
        if (!amount || amount <= 0) {
          return NextResponse.json(
            { success: false, error: "Valid deposit amount required" },
            { status: 400 }
          );
        }
        newBalance = wallet.balance + amount;
        result = await prisma.wallet.update({
          where: { id: walletId },
          data: { balance: newBalance },
        });
        break;

      case 'withdraw':
        if (!amount || amount <= 0) {
          return NextResponse.json(
            { success: false, error: "Valid withdrawal amount required" },
            { status: 400 }
          );
        }
        if (amount > wallet.balance) {
          return NextResponse.json(
            { success: false, error: "Insufficient balance" },
            { status: 400 }
          );
        }
        newBalance = wallet.balance - amount;
        result = await prisma.wallet.update({
          where: { id: walletId },
          data: { balance: newBalance },
        });
        break;

      case 'transfer':
        // This would be implemented with transfer logic
        return NextResponse.json(
          { success: false, error: "Transfer action fully implemented" },
          { status: 501 }
        );

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        walletId,
        amount,
        type: action,
        status: 'completed',
        description: description || `${action.charAt(0).toUpperCase() + action.slice(1)} transaction`,
        reference: reference || `TXN_${Date.now()}`,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: decoded.userId,
        username: decoded.email || 'unknown',
        action: `wallet_${action}`,
        resource: 'wallet',
        details: JSON.stringify({
          walletId,
          amount,
          newBalance,
          transactionId: transaction.id,
          userAgent: req.headers.get('user-agent'),
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        }),
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        riskLevel: amount > 10000 ? 'medium' : 'low',
        status: 'success',
      } as any,
    });

    return NextResponse.json({
      success: true,
      message: `Wallet ${action} completed successfully`,
      wallet: {
        id: wallet.id,
        balance: newBalance,
        currency: wallet.currency,
      },
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        type: transaction.type,
        status: transaction.status,
        description: transaction.description,
        reference: transaction.reference,
        createdAt: transaction.createdAt,
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Wallet POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process wallet operation",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

async function getWalletStats(walletId: string) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalDeposits,
    totalWithdrawals,
    transactionCount,
    recentActivity,
  ] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        walletId,
        type: 'deposit',
        createdAt: { gte: thirtyDaysAgo },
      },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        walletId,
        type: 'withdraw',
        createdAt: { gte: thirtyDaysAgo },
      },
      _sum: { amount: true },
    }),
    prisma.transaction.count({
      where: {
        walletId,
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    prisma.transaction.findMany({
      where: { walletId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { type: true, amount: true, createdAt: true },
    }),
  ]);

  return {
    monthlyDeposits: totalDeposits._sum.amount || 0,
    monthlyWithdrawals: totalWithdrawals._sum.amount || 0,
    monthlyTransactions: transactionCount,
    recentActivity,
  };
}
