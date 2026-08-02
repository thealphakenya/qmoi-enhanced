import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/admin/dashboard/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 * Requires authentication and admin role
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          _error: { message: "Missing authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    // Verify token synchronously
    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check if user is admin
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get dashboard statistics
    const totalUsers = await db.prisma.user.count();
    const activeUsers = await db.prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const totalTransactions = await db.prisma.transaction.count();
    const completedTransactions = await db.prisma.transaction.count({
      where: { status: "completed" },
    });

    const totalWallets = await db.prisma.wallet.count();

    // Get transaction volume
    const transactionVolume = await db.prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Get revenue (assume 2% transaction fee)
    const revenue = (transactionVolume._sum.amount || 0) * 0.02;

    // Get top users by transaction count
    const topUsers = await db.prisma.user.findMany({
      take: 5,
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(
      {
        dashboard: {
          users: {
            total: totalUsers,
            active: activeUsers,
            activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
          },
          transactions: {
            total: totalTransactions,
            completed: completedTransactions,
            completionRate: (
              (completedTransactions / totalTransactions) *
              100
            ).toFixed(2),
          },
          wallets: {
            total: totalWallets,
          },
          revenue: {
            transactionVolume: transactionVolume._sum.amount || 0,
            estimatedRevenue: revenue.toFixed(2),
          },
          topUsers: topUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            transactionCount: u._count?.transactions || 0,
          })),
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    (globalThis.console as any)?.error?.("Dashboard _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}
