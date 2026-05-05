import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db/prisma";
import { authService } from "../../../lib/auth/service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: "Authorization header required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = authService.decodeToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { revokeAllSessions = false } = body;

    // Get user info for audit log
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (revokeAllSessions) {
      // Revoke all active sessions for the user
      await prisma.session.updateMany({
        where: {
          userId: decoded.userId,
          expiresAt: { gt: new Date() },
        },
        data: { expiresAt: new Date() },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          username: user.email,
          action: 'logout_all_sessions',
          resource: 'auth',
          details: JSON.stringify({
            sessionId: decoded.sessionId,
            userAgent: req.headers.get('user-agent'),
            ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          }),
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          riskLevel: 'high',
          status: 'success',
        } as any,
      });

    } else {
      // Revoke only the current session
      if (decoded.sessionId) {
        await prisma.session.updateMany({
          where: { id: decoded.sessionId },
          data: { expiresAt: new Date() },
        });
      }

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          username: user.email,
          action: 'logout',
          resource: 'auth',
          details: JSON.stringify({
            sessionId: decoded.sessionId,
            userAgent: req.headers.get('user-agent'),
            ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          }),
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          riskLevel: 'low',
          status: 'success',
        } as any,
      });
    }

    // Update user's last logout time
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }, // This represents last activity, not login
    });

    return NextResponse.json({
      success: true,
      message: revokeAllSessions ? "Logged out from all sessions" : "Logged out successfully",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Logout failed",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Support GET requests for logout (useful for browser-based logout links)
  return POST(req);
}
