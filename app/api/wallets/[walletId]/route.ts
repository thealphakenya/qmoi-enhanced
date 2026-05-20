import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db/prisma";
import { authService } from "../../../../lib/auth/service";

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

        // Create transaction record for deposit
        const depositTx = await prisma.transaction.create({
          data: {
            walletId,
            amount,
            type: 'deposit',
            status: 'completed',
            description: description || 'Deposit transaction',
            reference: reference || `TXN_${Date.now()}`,
          },
        });

        await prisma.auditLog.create({
          data: {
            userId: decoded.userId,
            username: decoded.email || 'unknown',
            action: `wallet_deposit`,
            resource: 'wallet',
            details: JSON.stringify({ walletId, amount, newBalance, transactionId: depositTx.id }),
            ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
            riskLevel: 'low',
            status: 'success',
          } as any,
        });

        return NextResponse.json({
          success: true,
          message: `Wallet deposit completed successfully`,
          wallet: { id: wallet.id, balance: newBalance, currency: wallet.currency },
          transaction: depositTx,
          timestamp: new Date().toISOString(),
        });

      case 'withdraw':
        // Withdrawals are converted to pending withdrawal requests and require master approval
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

        const withdrawalRequest = await prisma.withdrawalRequest.create({
          data: {
            walletId,
            amount: Number(amount),
            currency: wallet.currency,
            requestedBy: decoded.userId,
            status: 'pending',
          },
        });

        await prisma.auditLog.create({
          data: {
            userId: decoded.userId,
            username: decoded.email || 'unknown',
            action: 'withdrawal_requested',
            resource: 'wallet',
            details: JSON.stringify({ walletId, amount, requestId: withdrawalRequest.id }),
            ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
            riskLevel: amount > 10000 ? 'medium' : 'low',
            status: 'pending',
          } as any,
        });

        return NextResponse.json({ success: true, status: 'pending', request: withdrawalRequest });

      case 'transfer':
        // Transfers are converted to pending transfer requests and require master approval
        const { toWalletId } = body;
        if (!toWalletId) {
          return NextResponse.json(
            { success: false, error: "toWalletId is required for transfer" },
            { status: 400 }
          );
        }
        if (!amount || amount <= 0) {
          return NextResponse.json(
            { success: false, error: "Valid transfer amount required" },
            { status: 400 }
          );
        }
        if (amount > wallet.balance) {
          return NextResponse.json(
            { success: false, error: "Insufficient balance" },
            { status: 400 }
          );
        }

        const transferRequest = await prisma.transferRequest.create({
          data: {
            fromWalletId: walletId,
            toWalletId,
            amount: Number(amount),
            currency: wallet.currency,
            requestedBy: decoded.userId,
            status: 'pending',
          },
        });

        await prisma.auditLog.create({
          data: {
            userId: decoded.userId,
            username: decoded.email || 'unknown',
            action: 'transfer_requested',
            resource: 'wallet',
            details: JSON.stringify({ fromWalletId: walletId, toWalletId, amount, requestId: transferRequest.id }),
            ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
            riskLevel: amount > 10000 ? 'medium' : 'low',
            status: 'pending',
          } as any,
        });

        return NextResponse.json({ success: true, status: 'pending', transferRequest });

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

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
