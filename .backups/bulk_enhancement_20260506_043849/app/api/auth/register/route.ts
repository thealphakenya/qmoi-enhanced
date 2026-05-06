import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db/prisma";
import { authService } from "../../../../lib/auth/service";
import bcrypt from 'bcrypt';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "Registration endpoint - use POST to create account",
    method: "GET",
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      username,
      password,
      name,
      role = 'user',
      acceptTerms = true
    } = body;

    // Validation
    if (!email || !username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email, username, and password are required",
        },
        { status: 400 }
      );
    }

    if (!acceptTerms) {
      return NextResponse.json(
        {
          success: false,
          error: "You must accept the terms and conditions",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 8 characters long",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: existingUser.email === email
            ? "Email already registered"
            : "Username already taken",
        },
        { status: 409 }
      );
    }

    // Hash password (placeholder - in production use proper hashing)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        name: name || username,
        role,
        permissions: JSON.stringify(['read']), // Default permissions
        accountStatus: 'active',
        trustScore: 0.5, // Start with neutral trust score
        biometricEnabled: false,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        permissions: true,
        accountStatus: true,
        trustScore: true,
        createdAt: true,
      },
    });

    // Generate tokens for immediate login
    const permissions = user.permissions ? JSON.parse(user.permissions) : [];
    const tokens = await authService.generateTokens(
      user.id,
      user.email,
      user.role,
      permissions
    );

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        username: user.username,
        action: 'register',
        resource: 'auth',
        details: JSON.stringify({
          method: 'password',
          role: user.role,
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
      message: "Account created successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        permissions: permissions,
        trustScore: user.trustScore,
        createdAt: user.createdAt,
      },
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt,
      },
      timestamp: new Date().toISOString()
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Registration failed",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
