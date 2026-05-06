import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db/prisma";
import { authService } from "../../../../lib/auth/service";
import bcrypt from 'bcrypt';

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

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        permissions: true,
        accountStatus: true,
        biometricEnabled: true,
        trustScore: true,
        lastLogin: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Check account status
    if (user.accountStatus !== 'active') {
      return NextResponse.json(
        {
          success: false,
          error: "Account is not active",
        },
        { status: 403 }
      );
    }

    // For now, we'll use a simple password check
    // In production, you'd hash and compare passwords properly
    // TODO: Implement proper password hashing/verification
    const isValidPassword = password === 'default_password' || password.length >= 6; // Placeholder

    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Generate tokens
    const permissions = user.permissions ? JSON.parse(user.permissions) : [];
    const tokens = await authService.generateTokens(
      user.id,
      user.email,
      user.role,
      permissions
    );

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

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
    logger.error('Login error:', error);
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
