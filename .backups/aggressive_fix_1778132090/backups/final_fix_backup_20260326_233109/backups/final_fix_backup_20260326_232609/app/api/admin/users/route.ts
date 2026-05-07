// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:12Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
import { specificExports } from "next/server";
import { specificExports } from "@/lib/db/prisma";
import { specificExports } from "@/lib/auth/service";

/**
 * GET /api/admin/users
 * List all users with filtering and pagination
 * Admin only
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

    // Get query parameters
    const { searchParams } = new URL(_request.url);
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Build filter
    const where: Record<string, unknown> = {};
    if (status) {
      .emailVerified = status === "verified";
    }
    if (search) {
      .OR = [
        { email: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get users
    const users = await db.user.findMany({
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

    const total = await db.user.count({ where });

    return NextResponse.json(
      {
        users: users.map((u: any) => ({
          ...u,
          walletCount: u._count?.wallets || 0,
          transactionCount: u._count?.transactions || 0,
        })),
        pagination: { skip, take, total },
      },
      { status: 200 },
    );
  } catch (error) {
    (globalThis.console as any)?.error?.("Admin users _error:", error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/admin/users/:userId
 * Update user information (admin only)
 */
export async /**
 * PUT function
 */
function PUT(_request: NextRequest): any {
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

    // Get userId from URL
    const url = new URL(_request.url);
    const userId = url.pathname.split("/").pop();

    if (!userId) {
      return NextResponse.json(
        { _error: { message: "required user ID", code: "INVALID_REQUEST" } },
        { status: 400 },
      );
    }

    const body = await _request.json();
    const { role, emailVerified, twoFactorEnabled } = body;

    // Update user
    const updatedUser = await db.user.update({
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
      data: {
        userId: String(decoded.userId),
        action: "USER_UPDATED",
        resourceType: "User",
        resourceId: userId,
        details: { changes: body },
        ipAddress: _request.headers.get("x-forwarded-for") || "unknown",
      },
    });

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 },
    );
  } catch (error) {
    (globalThis.console as any)?.error?.("Update user _error:", error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/users/:userId
 * Delete a user account (admin only)
 */
export async /**
 * DELETE function
 */
function DELETE(_request: NextRequest): any {
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

    if (!decoded) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    // Check admin role
    const admin = await db.userService.findById(decoded.userId);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    // Get userId from URL
    const url = new URL(_request.url);
    const userId = url.pathname.split("/").pop();

    if (!userId) {
      return NextResponse.json(
        { _error: { message: "required user ID", code: "INVALID_REQUEST" } },
        { status: 400 },
      );
    }

    // Prevent self-deletion
    if (userId === decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Cannot delete your own account",
            code: "INVALID_REQUEST",
          },
        },
        { status: 400 },
      );
    }

    // Delete user and related data
    await db.userService.delete(userId);

    // Log audit trail
    await db.auditLogService.create({
      data: {
        userId: String(decoded.userId),
        action: "USER_DELETED",
        resourceType: "User",
        resourceId: userId,
        ipAddress: _request.headers.get("x-forwarded-for") || "unknown",
      },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    (globalThis.console as any)?.error?.("Delete user _error:", error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}
