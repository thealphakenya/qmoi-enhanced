import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "../../../lib/auth-service";
import { prisma } from "../../../lib/db/prisma";
import { logger } from "@/lib/logger";
import { deleteCookie } from "@/lib/cookies";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const revokeAllSessions = Boolean(body.revokeAllSessions);
    const authHeader = req.headers.get("authorization");
    const sessionId = req.cookies.get("sessionId")?.value ||
      (authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : undefined);

    if (!sessionId) {
      const response = NextResponse.json(
        { success: false, message: "No active session found" },
        { status: 401 }
      );
      deleteCookie(response, "accessToken", { path: "/" });
      deleteCookie(response, "refreshToken", { path: "/" });
      return response;
    }

    const session = await AuthService.verifySession(sessionId);
    if (!session) {
      const response = NextResponse.json(
        { success: false, message: "Session is invalid or expired" },
        { status: 401 }
      );
      deleteCookie(response, "accessToken", { path: "/" });
      deleteCookie(response, "refreshToken", { path: "/" });
      return response;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true },
    });

    if (!user) {
      const response = NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
      deleteCookie(response, "accessToken", { path: "/" });
      deleteCookie(response, "refreshToken", { path: "/" });
      return response;
    }

    if (revokeAllSessions) {
      await prisma.session.updateMany({
        where: {
          userId: session.userId,
          expiresAt: { gt: new Date() },
        },
        data: { expiresAt: new Date(), isActive: false },
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          username: user.email,
          action: 'logout_all_sessions',
          resource: 'auth',
          details: JSON.stringify({
            sessionId,
            userAgent: req.headers.get('user-agent'),
            ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          }),
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          riskLevel: 'high',
          status: 'success',
        } as any,
      });
    } else {
      await AuthService.logout(sessionId);

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          username: user.email,
          action: 'logout',
          resource: 'auth',
          details: JSON.stringify({
            sessionId,
            userAgent: req.headers.get('user-agent'),
            ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          }),
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          riskLevel: 'low',
          status: 'success',
        } as any,
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const response = NextResponse.json({
      success: true,
      message: revokeAllSessions ? "Logged out from all sessions" : "Logged out successfully",
      timestamp: new Date().toISOString(),
    });

    deleteCookie(response, "accessToken", { path: "/" });
    deleteCookie(response, "refreshToken", { path: "/" });
    return response;

  } catch (error) {
    logger.error('Logout error:', error);
    const response = NextResponse.json(
      {
        success: false,
        error: "Logout failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
    deleteCookie(response, "accessToken", { path: "/" });
    deleteCookie(response, "refreshToken", { path: "/" });
    return response;
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
