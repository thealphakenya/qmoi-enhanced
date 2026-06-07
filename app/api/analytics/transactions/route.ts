// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:10Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability
import { NextRequest, NextResponse } from "next/server";
import { prisma as db } from "@/lib/db/prisma";
import logger from '@/lib/logger';
import { requireApiKey } from '@/lib/proposals';
import authService from '@/lib/auth/service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest): Promise<any> {
  try {
    const apiCheck = requireApiKey(req.headers);
    if (!apiCheck.ok) {
      return NextResponse.json(apiCheck.response?.body || { error: 'Unauthorized' }, { status: apiCheck.response?.status || 401 });
    }

    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
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
    } catch (_error){
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }
    if (!decoded) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const groupBy = searchParams.get("groupBy") || "day"; // day, week, month
    // Build date filter
    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }
    // Get transactions in date range
    const transactions = await db.transaction.findMany({
      where: {
        userId: decoded.userId,
        createdAt: dateFilter,
      },
      select: {
        id: true,
        amount: true,
        type: true,
        status: true,
        createdAt: true,
        currency: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    // Group transactions by date/period
    const grouped = groupTransactions(transactions, groupBy);
    // Calculate statistics
    const stats = calculateStats(transactions);
    return NextResponse.json(
      {
        analytics: {
          period: {
            startDate,
            endDate,
            groupBy,
          },
          statistics: stats,
          grouped,
          rawCount: transactions.length,
        },
      },
      { status: 200 },
    );
  } catch (_error){
    logger.error("Analytics _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server _error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}
function groupTransactions(
  transactions: any[],
  groupBy: string,
): Record<string, any[]> {
  const grouped: Record<string, any[]> = {};
  for (const txn of transactions) {
    const date = new Date(txn.createdAt);
    let key = "";
    if (groupBy === "day") {
      key = date.toISOString().split("T")[0];
    } else if (groupBy === "week") {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toISOString().split("T")[0];
    } else if (groupBy === "month") {
      key = date.toISOString().substring(0, 7);
    }
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(txn);
  }
  return grouped;
}
function calculateStats(transactions: unknown[]): Promise<any> {
  const stats = {
    totalTransactions: transactions.length,
    totalAmount: 0,
    byType: {} as Record<string, number>,
    byStatus: {} as Record<string, number>,
    byCurrency: {} as Record<string, number>,
    averageAmount: 0,
  };
  for (const txn of transactions as any[]) {
    stats.totalAmount += txn.amount;
    // Count by type
    stats.byType[txn.type] = (stats.byType[txn.type] || 0) + 1;
    // Count by status
    stats.byStatus[txn.status] = (stats.byStatus[txn.status] || 0) + 1;
    // Count by currency
    stats.byCurrency[txn.currency] = (stats.byCurrency[txn.currency] || 0) + 1;
  }
  stats.averageAmount = stats.totalAmount / stats.totalTransactions || 0;
  return stats;
}
