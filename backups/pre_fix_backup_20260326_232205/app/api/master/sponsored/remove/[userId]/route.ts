// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth/service";
import { db } from "@/lib/db/prisma";

/**
 * DELETE /api/master/sponsored/remove/[userId]
 * Remove a sponsored user (Master only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    // Verify master authentication
    const authHeader = request.headers.get("authorization");
    const biometricToken = request.headers.get("x-biometric-verification");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "required authorization token", code: "NO_TOKEN" },
        { status: 401 },
      );
    }

    const token = authHeader.replace("Bearer ", "");
    let decoded;

    try {
      decoded = authService.verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid token", code: "INVALID_TOKEN" },
        { status: 401 },
      );
    }

    // Verify master role
    const user = await db.userService.findById(decoded.userId);
    if (!user || user.role !== "master") {
      return NextResponse.json(
        { error: "Master access required", code: "FORBIDDEN" },
        { status: 403 },
      );
    }

    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required", code: "MISSING_USER_ID" },
        { status: 400 },
      );
    }

    // Find the user to remove
    const userToRemove = await db.userService.findById(userId);
    if (!userToRemove) {
      return NextResponse.json(
        { error: "User not found", code: "USER_NOT_FOUND" },
        { status: 404 },
      );
    }

    // Verify user is sponsored
    if (!userToRemove.isSponsored && userToRemove.role !== "sponsored") {
      return NextResponse.json(
        { error: "User is not sponsored", code: "NOT_SPONSORED" },
        { status: 400 },
      );
    }

    // Remove sponsored status (demote to regular user)
    await db.userService.update(userId, {
      role: "regular",
      isSponsored: false,
      sponsorProgram: null,
      benefits: null,
      metadata: JSON.stringify({
        ...JSON.parse(userToRemove.metadata || "{}"),
        demotedAt: new Date().toISOString(),
        demotedBy: user.id,
        previousRole: userToRemove.role,
      }),
    });

    return NextResponse.json({
      success: true,
      message: "Sponsored user removed successfully",
      userId,
      rateLimitExempt: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error removing sponsored user:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "SERVER_ERROR" },
      { status: 500 },
    );
  }
}
