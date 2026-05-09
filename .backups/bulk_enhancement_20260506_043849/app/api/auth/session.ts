import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db/prisma";
import { authService } from "../../../lib/auth/service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // Get user from auth token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = authService.decodeToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    // Get active sessions for the user
    const sessions = await prisma.session.findMany({
      where: {
        userId: decoded.userId,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        PRODUCTIONiceInfo: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        expiresAt: true,
        lastActivityAt: true,
        isCurrentSession: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Mark current session
    const currentSessionId = decoded.sessionId;
    const sessionsWithCurrent = sessions.map(session => ({
      ...session,
      isCurrentSession: session.id === currentSessionId,
    }));

    return NextResponse.json({
      success: true,
      message: "Active sessions retrieved",
      sessions: sessionsWithCurrent,
      currentSessionId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Session GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve sessions",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, sessionId } = body;

    // Get user from auth token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = authService.decodeToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    if (action === 'revoke') {
      if (!sessionId) {
        return NextResponse.json(
          { success: false, error: "sessionId is required for revoke action" },
          { status: 400 }
        );
      }

      // Check if session belongs to user
      const session = await prisma.session.findFirst({
        where: {
          id: sessionId,
          userId: decoded.userId,
        },
      });

      if (!session) {
        return NextResponse.json(
          { success: false, error: "Session not found" },
          { status: 404 }
        );
      }

      // Revoke session
      await prisma.session.update({
        where: { id: sessionId },
        data: { expiresAt: new Date() },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId: decoded.userId,
          username: decoded.email || 'unknown',
          action: 'session_revoke',
          resource: 'auth',
          details: JSON.stringify({
            revokedSessionId: sessionId,
            userAgent: req.headers.get('user-agent'),
            ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          }),
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          riskLevel: 'medium',
          status: 'success',
        } as any,
      });

      return NextResponse.json({
        success: true,
        message: "Session revoked successfully",
        revokedSessionId: sessionId,
        timestamp: new Date().toISOString()
      });

    } else if (action === 'revoke-all') {
      // Revoke all sessions except current
      const currentSessionId = decoded.sessionId;

      await prisma.session.updateMany({
        where: {
          userId: decoded.userId,
          id: { not: currentSessionId },
          expiresAt: { gt: new Date() },
        },
        data: { expiresAt: new Date() },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId: decoded.userId,
          username: decoded.email || 'unknown',
          action: 'session_revoke_all',
          resource: 'auth',
          details: JSON.stringify({
            currentSessionId,
            userAgent: req.headers.get('user-agent'),
            ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          }),
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          riskLevel: 'high',
          status: 'success',
        } as any,
      });

      return NextResponse.json({
        success: true,
        message: "All other sessions revoked successfully",
        currentSessionId,
        timestamp: new Date().toISOString()
      });

    } else if (action === 'extend') {
      if (!sessionId) {
        return NextResponse.json(
          { success: false, error: "sessionId is required for extend action" },
          { status: 400 }
        );
      }

      // Check if session belongs to user
      const session = await prisma.session.findFirst({
        where: {
          id: sessionId,
          userId: decoded.userId,
        },
      });

      if (!session) {
        return NextResponse.json(
          { success: false, error: "Session not found" },
          { status: 404 }
        );
      }

      // Extend session by 24 hours
      const newExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await prisma.session.update({
        where: { id: sessionId },
        data: {
          expiresAt: newExpiry,
          lastActivityAt: new Date(),
        },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId: decoded.userId,
          username: decoded.email || 'unknown',
          action: 'session_extend',
          resource: 'auth',
          details: JSON.stringify({
            extendedSessionId: sessionId,
            newExpiry: newExpiry.toISOString(),
            userAgent: req.headers.get('user-agent'),
            ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          }),
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          riskLevel: 'low',
          status: 'success',
        } as any,
      });

      return NextResponse.json({
        success: true,
        message: "Session extended successfully",
        extendedSessionId: sessionId,
        newExpiry,
        timestamp: new Date().toISOString()
      });

    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action. Supported: revoke, revoke-all, extend" },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Session POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to manage session",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
