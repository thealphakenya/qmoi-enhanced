// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-05-19T00:00:00Z
// Evolution features: authenticated session access, API key fallback, production wallet analytics
import { NextRequest, NextResponse } from "next/server";
import { prisma as db } from "@/lib/db/prisma";
import { authService } from "@/app/lib/auth/service";
import { requireApiKey } from "@/lib/proposals";
import logger from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface WalletAnalyticsRecord {
  id: string;
  currency: string | null;
  balance?: number | null;
  status?: string | null;
  createdAt: string;
}

function extractToken(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7).trim()
    : authHeader?.trim();

  return bearerToken || req.cookies.get("accessToken")?.value || undefined;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const apiCheck = requireApiKey(req.headers);
    const token = extractToken(req);
    let decoded: any = null;

    if (token) {
      try {
        decoded = authService.verifyToken(token);
      } catch (_error) {
        decoded = null;
      }
    }

    let userId = decoded?.userId ? String(decoded.userId) : undefined;

    if (!userId) {
      if (!apiCheck.ok) {
        return NextResponse.json(apiCheck.response?.body || { error: "Unauthorized" }, { status: apiCheck.response?.status || 401 });
      }

      userId = new URL(req.url).searchParams.get("userId") || undefined;
      if (!userId) {
        return NextResponse.json(
          { error: "User ID is required when accessing this endpoint with an API key." },
          { status: 403 },
        );
      }
    }

    const wallets = await db.wallet.findMany({
      where: { userId },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const transactions = await db.transaction.findMany({
      where: {
        wallet: { userId },
      },
      select: {
        walletId: true,
        amount: true,
        currency: true,
        type: true,
        status: true,
        description: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const stats = {
      totalWallets: wallets.length,
      totalBalance: 0,
      currencyDistribution: {} as Record<string, any>,
      walletUtilization: 0,
      transactionStats: {
        totalTransactions: transactions.length,
        averageTransactionSize: 0,
      },
    };

    const transactionsByWallet: Record<string, typeof transactions> = {};
    for (const transaction of transactions) {
      const walletId = String(transaction.walletId);
      if (!transactionsByWallet[walletId]) {
        transactionsByWallet[walletId] = [];
      }
      transactionsByWallet[walletId].push(transaction);
    }

    for (const wallet of wallets) {
      const balance = Number(wallet.balance ?? 0);
      stats.totalBalance += balance;
      const currency = String(wallet.currency ?? "UNKNOWN");

      if (!stats.currencyDistribution[currency]) {
        stats.currencyDistribution[currency] = {
          currency,
          walletCount: 0,
          totalBalance: 0,
          averageBalance: 0,
        };
      }

      stats.currencyDistribution[currency].walletCount += 1;
      stats.currencyDistribution[currency].totalBalance += balance;
    }

    for (const distribution of Object.values(stats.currencyDistribution) as any[]) {
      distribution.averageBalance = distribution.walletCount > 0 ? distribution.totalBalance / distribution.walletCount : 0;
    }

    const activeWallets = wallets.filter((wallet: WalletAnalyticsRecord) => {
      const walletTxns = transactionsByWallet[String(wallet.id)] || [];
      return walletTxns.length > 0;
    }).length;

    stats.walletUtilization = wallets.length > 0 ? (activeWallets / wallets.length) * 100 : 0;
    stats.transactionStats.averageTransactionSize = stats.transactionStats.totalTransactions > 0
      ? stats.totalBalance / stats.transactionStats.totalTransactions
      : 0;

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentWallets = await db.wallet.count({
      where: {
        userId,
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    const recentTransactions = await db.transaction.count({
      where: {
        wallet: { userId },
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    return NextResponse.json(
      {
        analytics: {
          overview: stats,
          growth: {
            newWalletsLast30Days: recentWallets,
            transactionsLast30Days: recentTransactions,
          },
          wallets: wallets.map((wallet: any) => ({
            id: wallet.id,
            currency: wallet.currency,
            balance: wallet.balance,
            transactionCount: wallet._count?.transactions ?? 0,
            status: wallet.status,
            createdAt: wallet.createdAt,
          })),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Wallet analytics _error:", error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}
