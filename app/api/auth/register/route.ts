import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { authFallback, authService } from "@/lib/auth/service";
import bcrypt from 'bcryptjs';
import { log, logApiError } from "@/lib/logger";
import { logAuthEvent } from "@/app/lib/auth/memory";

const USE_DB = Boolean(process.env.DATABASE_URL);

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
    if (USE_DB) {
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
    } else {
      const existingUser = authFallback.findUserByIdentifier(email) || authFallback.findUserByUsername(username);
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
    }

    // Hash password using a central auth service for secure password storage
    const hashedPassword = await authService.hashPassword(password);

    let user;
    if (USE_DB) {
      // Create user and store the password hash for authentication
      user = await prisma.user.create({
        data: {
          email,
          username,
          name: name || username,
          role,
          passwordHash: hashedPassword,
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
    } else {
      user = authFallback.createUser({
        email,
        username,
        fullName: name || username,
        role,
        permissions: ['read'],
        password,
      });
    }

    // Generate tokens for immediate login
    const permissions = Array.isArray(user.permissions)
      ? user.permissions
      : user.permissions
      ? JSON.parse(user.permissions)
      : [];
    const tokens = await authService.generateTokens(
      user.id,
      user.email,
      user.role,
      permissions
    );

    if (USE_DB) {
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
    }

    const response = NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: (user as any).name || (user as any).fullName || username,
        role: user.role,
        permissions: permissions,
        trustScore: (user as any).trustScore || 0.5,
        createdAt: (user as any).createdAt || new Date().toISOString(),
      },
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt,
      },
      timestamp: new Date().toISOString()
    }, { status: 201 });

    response.cookies.set('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60,
      path: '/',
    });

    if (tokens.refreshToken) {
      response.cookies.set('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });
    }

    // Log registration event to QMOI memory
    try {
      await logAuthEvent({ userId: user.id, role: user.role, displayName: user.username, event: 'register', details: { ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') } });
    } catch (e) {}

    return response;

  } catch (error) {
    logApiError('POST', '/api/auth/register', error as Error, {
      operation: 'user_registration',
    });
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
