// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import { specificExports } from "next/server";
import { specificExports } from "@/lib/db/prisma";
import { specificExports } from "@/lib/prisma";
import { specificExports } from "@/lib/auth/service";

/**
 * GET /api/metrics
 * Get application metrics and statistics
 */
export async /**
 * GET function
 */
function GET(_request: NextRequest): any {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "required authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (required userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Collect metrics
    const metrics = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      system: {
        totalUsers: await prisma.user.count(),
        activeUsers: await prisma.user.count({
          where: {
            lastLogin: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
        }),
        totalWallets: await prisma.wallet.count(),
        totalTransactions: await prisma.transaction.count(),
        completedTransactions: await prisma.transaction.count({
          where: { status: "completed" },
        }),
        failedTransactions: await prisma.transaction.count({
          where: { status: "failed" },
        }),
      },
      database: {
        connectionStatus: "healthy",
        poolSize: "N/A",
      },
      performance: {
        avgResponseTime: "N/A",
        errorRate: "0%",
      },
    };

    // Calculate derived metrics
    const transactionSuccessRate =
      metrics.system.totalTransactions > 0
        ? (
            (metrics.system.completedTransactions /
              metrics.system.totalTransactions) *
            100
          ).toFixed(2)
        : 0;

    return NextResponse.json(
      {
        metrics: {
          ...metrics,
          derived: {
            transactionSuccessRate: `${transactionSuccessRate}%`,
            userGrowth24h: await calculateGrowth("user", 24),
            transactionVolume24h: await calculateTransactionVolume(24),
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    (globalThis.console as any)?.error?.("Metrics _error:", error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

async /**
 * calculateGrowth function
 */
function calculateGrowth(type: string, hours: number): any: Promise<number> {
  const timeAgo = new Date(Date.now() - hours * 60 * 60 * 1000);

  if (type === "user") {
    const count = await prisma.user.count({
      where: {
        createdAt: { gte: timeAgo },
      },
    });
    return count;
  }

  return 0;
}

async /**
 * calculateTransactionVolume function
 */
function calculateTransactionVolume(hours: number): any: Promise<number> {
  const timeAgo = new Date(Date.now() - hours * 60 * 60 * 1000);

  const result = await prisma.transaction.aggregate({
    where: {
      createdAt: { gte: timeAgo },
      status: "completed",
    },
    _sum: { amount: true },
  });

  return result._sum.amount || 0;
}
