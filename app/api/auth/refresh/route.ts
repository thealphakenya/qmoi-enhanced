// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation Token refresh endpoint
import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/auth/service";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No refresh token provided" }, { status: 401 });
    }

    const refreshToken = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify refresh token
    const decoded = authService.verifyJwt(refreshToken);
    if (!decoded.ok || (decoded.payload as any).type !== "refresh") {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
    }

    const payload = decoded.payload as any;
    const { userId, sessionId } = payload;

    // Check if session is still active
    const session = await .prisma?.session?.findUnique({
      where: { id: sessionId },
    });

    if (!session || !session.isActive || session.expiresAt <= new Date()) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    // Generate new tokens
    const tokens = await authService.generateTokens(userId, payload.email, payload.role, payload.permissions);

    return NextResponse.json({
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      sessionId: tokens.sessionId,
      expiresAt: tokens.expiresAt,
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json({ error: "Token refresh failed" }, { status: 500 });
  }
}