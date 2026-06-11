import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db/prisma";
import { authService } from "@/lib/auth/service";
import logger from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
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

    // Get user details from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        emailVerified: true,
        twoFactorEnabled: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            avatar: true,
            bio: true,
            timezone: true,
            language: true,
          },
        },
        wallets: {
          select: {
            id: true,
            balance: true,
            currency: true,
          },
          take: 3, // Show primary wallets
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: "Account is deactivated" },
        { status: 403 }
      );
    }

    // Update last activity
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        username: user.email,
        action: 'token_verify',
        resource: 'auth',
        details: JSON.stringify({
          tokenType: 'access',
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
      message: "Token verified successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        profile: user.profile,
        wallets: user.wallets,
      },
      token: {
        expiresAt: decoded.exp ? new Date(decoded.exp * 1000) : null,
        issuedAt: decoded.iat ? new Date(decoded.iat * 1000) : null,
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Auth verify GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Token verification failed",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token is required" },
        { status: 400 }
      );
    }

    const decoded = authService.decodeToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Get user details from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        emailVerified: true,
        twoFactorEnabled: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            avatar: true,
            bio: true,
            timezone: true,
            language: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: "Account is deactivated" },
        { status: 403 }
      );
    }

    // Check if token is close to expiry and suggest refresh
    const now = Math.floor(Date.now() / 1000);
    const timeToExpiry = decoded.exp ? decoded.exp - now : 0;
    const shouldRefresh = timeToExpiry < 300; // Less than 5 minutes

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        username: user.email,
        action: 'token_verify_post',
        resource: 'auth',
        details: JSON.stringify({
          tokenType: 'access',
          shouldRefresh,
          timeToExpiry,
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
      message: "Token verified successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        profile: user.profile,
      },
      token: {
        expiresAt: decoded.exp ? new Date(decoded.exp * 1000) : null,
        issuedAt: decoded.iat ? new Date(decoded.iat * 1000) : null,
        shouldRefresh,
        timeToExpiry,
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Auth verify POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Token verification failed",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
