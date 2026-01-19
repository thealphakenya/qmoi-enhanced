import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/analytics/wallets
 * Get wallet analytics and performance metrics
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: { message: "Missing authorization token", code: "NO_TOKEN" } },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 }
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 }
      );
    }

    const userId = String(decoded.userId);

    // Get all user wallets
    const wallets = (await db.prisma.wallet.findMany({
      where: { userId },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    })) as Array<{
      id: string;
      currency?: unknown;
      balance?: unknown;
      createdAt?: unknown;
      status?: unknown;
      _count?: { transactions?: number };
    }>;

    // Get wallet statistics
    const stats = {
      totalWallets: wallets.length,
      totalBalance: 0,
      currencyDistribution: {} as Record<string, any>,
      walletUtilization: 0,
      transactionStats: {
        totalTransactions: 0,
        averageTransactionSize: 0,
      },
    };

    const transactionsByWallet: Record<string, any[]> = {};

    for (const wallet of wallets) {
      const bal = Number(wallet.balance ?? 0);
      stats.totalBalance += bal;

      const cur = String(wallet.currency ?? "UNKNOWN");
      if (!stats.currencyDistribution[cur]) {
        stats.currencyDistribution[cur] = {
          currency: cur,
          walletCount: 0,
          totalBalance: 0,
          averageBalance: 0,
        };
      }

      stats.currencyDistribution[cur].walletCount += 1;
      stats.currencyDistribution[cur].totalBalance += bal;

      // Get wallet transactions
      const walletTxns = (await db.prisma.transaction.findMany({
        where: { walletId: String(wallet.id) },
      })) as any[] as Array<Record<string, unknown>>;

      transactionsByWallet[String(wallet.id)] = walletTxns;
      stats.transactionStats.totalTransactions += walletTxns.length;
    }

    // Calculate averages
    Object.values(stats.currencyDistribution).forEach((dist: unknown) => {
      dist.averageBalance = dist.totalBalance / dist.walletCount;
    });

    // Calculate wallet utilization (wallets with transactions / total wallets)
    const activeWallets = Object.keys(transactionsByWallet).filter(
      (walletId) => transactionsByWallet[walletId].length > 0
    ).length;

    stats.walletUtilization =
      wallets.length > 0 ? (activeWallets / wallets.length) * 100 : 0;

    if (stats.transactionStats.totalTransactions > 0) {
      stats.transactionStats.averageTransactionSize =
        stats.totalBalance / stats.transactionStats.totalTransactions;
    }

    // Get growth metrics (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentWallets = await db.prisma.wallet.count({
      where: {
        userId,
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    const recentTransactions = await db.prisma.transaction.count({
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
          wallets: wallets.map((w: unknown) => ({
            id: w.id,
            currency: w.currency,
            balance: w.balance,
            transactionCount: w._count?.transactions ?? 0,
            createdAt: w.createdAt,
            status: w.status,
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    (globalThis.console as any)?.error?.("Wallet analytics error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 }
    );
  }
}
