import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

/**
 * GET /api/admin/users
 * List all users with filtering and pagination
 * Admin only
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

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

    // Check admin role
    const user = await db.userService.findById(decoded.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Build filter
    const where: any = {};
    if (status) {
      where.emailVerified = status === "verified";
    }
    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get users
    const users = await db.prisma.user.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        emailVerified: true,
        role: true,
        twoFactorEnabled: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            wallets: true,
            transactions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const total = await db.prisma.user.count({ where });

    return NextResponse.json(
      {
        users: users.map((u) => ({
          ...u,
          walletCount: u._count.wallets,
          transactionCount: u._count.transactions,
        })),
        pagination: { skip, take, total },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/users/:userId
 * Update user information (admin only)
 */
export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

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

    // Check admin role
    const admin = await db.userService.findById(decoded.userId);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        { error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 }
      );
    }

    // Get userId from URL
    const url = new URL(request.url);
    const userId = url.pathname.split("/").pop();

    if (!userId) {
      return NextResponse.json(
        { error: { message: "Missing user ID", code: "INVALID_REQUEST" } },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { role, emailVerified, twoFactorEnabled } = body;

    // Update user
    const updatedUser = await db.prisma.user.update({
      where: { id: userId },
      data: {
        ...(role && { role }),
        ...(emailVerified !== undefined && { emailVerified }),
        ...(twoFactorEnabled !== undefined && { twoFactorEnabled }),
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        emailVerified: true,
        twoFactorEnabled: true,
      },
    });

    // Log audit trail
    await db.auditLogService.create({
      userId: decoded.userId,
      action: "USER_UPDATED",
      resourceType: "User",
      resourceId: userId,
      details: { changes: body },
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
    });

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/:userId
 * Delete a user account (admin only)
 */
export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

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

    // Check admin role
    const admin = await db.userService.findById(decoded.userId);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        { error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 }
      );
    }

    // Get userId from URL
    const url = new URL(request.url);
    const userId = url.pathname.split("/").pop();

    if (!userId) {
      return NextResponse.json(
        { error: { message: "Missing user ID", code: "INVALID_REQUEST" } },
        { status: 400 }
      );
    }

    // Prevent self-deletion
    if (userId === decoded.userId) {
      return NextResponse.json(
        {
          error: {
            message: "Cannot delete your own account",
            code: "INVALID_REQUEST",
          },
        },
        { status: 400 }
      );
    }

    // Delete user and related data
    await db.prisma.user.delete({
      where: { id: userId },
    });

    // Log audit trail
    await db.auditLogService.create({
      userId: decoded.userId,
      action: "USER_DELETED",
      resourceType: "User",
      resourceId: userId,
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 }
    );
  }
}
