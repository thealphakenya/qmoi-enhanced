import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db/prisma";
import { authService } from "../../../../lib/auth/service";
import { log } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "Login endpoint - use POST to authenticate",
    method: "GET",
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, rememberMe = false } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // Authenticate using central auth service (handles DB and fallback)
    const authResult = await authService.authenticatePassword(email, password);

    if (!authResult || !authResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    const user = authResult.user as any;
    const tokens = authResult.tokens as any;

    const permissions = Array.isArray(user.permissions)
      ? user.permissions
      : user.permissions
      ? JSON.parse(user.permissions)
      : [];

    // Update last login in user record if using DB
    try {
      if (user?.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });
      }
    } catch (_e) {
      // ignore update errors
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        username: user.username,
        action: 'login',
        resource: 'auth',
        details: JSON.stringify({
          method: 'password',
          rememberMe,
          userAgent: req.headers.get('user-agent'),
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        }),
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        riskLevel: 'low',
        status: 'success',
        sessionId: tokens.sessionId,
      } as any,
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        permissions: permissions,
        trustScore: user.trustScore,
        biometricEnabled: user.biometricEnabled,
      },
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt,
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    log.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Login failed",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
