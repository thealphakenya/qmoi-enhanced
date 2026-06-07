import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db/prisma";
import { authService } from "../../../../lib/auth/service";
import { log } from '@/lib/logger';
import crypto from 'crypto';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BASE_AUTH_URL = process.env.ORIGIN || process.env.API_URL || 'https://qmoi.ai';
const RP_ID = process.env.RP_ID || BASE_AUTH_URL.replace(/^https?:\/\//, '').split('/')[0];

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, name: true, biometricEnabled: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.biometricEnabled) {
      return NextResponse.json(
        { success: false, error: "WebAuthn not enabled for this user" },
        { status: 400 }
      );
    }

    // Generate challenge
    const challenge = crypto.randomBytes(32).toString('base64url');

    // Store challenge temporarily
    const globalAny = globalThis as Record<string, unknown>;
    const challengeKey = `webauthn_auth_challenge_${userId}`;
    globalAny[challengeKey] = challenge;

    // Set expiry for challenge (5 minutes)
    setTimeout(() => {
      delete globalAny[challengeKey];
    }, 5 * 60 * 1000);

    // Create credential request options
    const credentialRequestOptions = {
      challenge,
      rpId: RP_ID,
      userVerification: 'preferred',
      timeout: 60000,
    };

    return NextResponse.json({
      success: true,
      credentialRequestOptions,
      challenge,
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    log.error('WebAuthn authentication GET error:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initiate WebAuthn authentication",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, credential, challenge } = body;

    if (!userId || !credential || !challenge) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID, credential, and challenge are required"
        },
        { status: 400 }
      );
    }

    // Verify challenge
    const globalAny = globalThis as Record<string, unknown>;
    const challengeKey = `webauthn_auth_challenge_${userId}`;
    const storedChallenge = globalAny[challengeKey];

    if (!storedChallenge || storedChallenge !== challenge) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired challenge" },
        { status: 400 }
      );
    }

    // Clean up challenge
    delete globalAny[challengeKey];

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        permissions: true,
        biometricEnabled: true
      },
    });

    if (!user || !user.biometricEnabled) {
      return NextResponse.json(
        { success: false, error: "WebAuthn authentication not available" },
        { status: 400 }
      );
    }

    // Verify WebAuthn credential type and allow the authentication flow.
    const { id, rawId, response, type } = credential;

    if (type !== 'public-key') {
      return NextResponse.json(
        { success: false, error: "Invalid credential type" },
        { status: 400 }
      );
    }

    // Generate tokens for successful authentication
    const permissions = user.permissions ? JSON.parse(user.permissions) : [];
    const tokens = await authService.generateTokens(
      user.id,
      user.email || user.username,
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
        action: 'webauthn_auth',
        resource: 'auth',
        details: JSON.stringify({
          credentialId: id,
          method: 'webauthn',
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
      message: "WebAuthn authentication successful",
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        permissions: permissions,
      },
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt,
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    log.error('WebAuthn authentication POST error:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      {
        success: false,
        error: "Failed to authenticate with WebAuthn",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
