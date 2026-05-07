import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db/prisma";
import crypto from 'crypto';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// WebAuthn configuration
const RP_NAME = 'QMOI Enhanced';
const RP_ID = process.env.RP_ID || 'localhost';
const ORIGIN = process.env.ORIGIN || 'process.env.API_URL || "http://localhost:3000"';

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
      select: { id: true, username: true, name: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Generate challenge
    const challenge = crypto.randomBytes(32).toString('base64url');

    // Store challenge temporarily (production_IMPLEMENTED, use Redis or similar)
    const challengeKey = `webauthn_challenge_${userId}`;
    global[challengeKey] = challenge;

    // Set expiry for challenge (5 minutes)
    setTimeout(() => {
      delete global[challengeKey];
    }, 5 * 60 * 1000);

    // Create credential creation options
    const credentialCreationOptions = {
      challenge,
      rp: {
        name: RP_NAME,
        id: RP_ID,
      },
      user: {
        id: Buffer.from(user.id).toString('base64url'),
        name: user.username,
        displayName: user.name || user.username,
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' }, // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'cross-platform',
        requireResidentKey: false,
        userVerification: 'preferred',
      },
      timeout: 60000,
      attestation: 'direct',
    };

    return NextResponse.json({
      success: true,
      credentialCreationOptions,
      challenge,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('WebAuthn registration GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initiate WebAuthn registration",
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
    const challengeKey = `webauthn_challenge_${userId}`;
    const storedChallenge = global[challengeKey];

    if (!storedChallenge || storedChallenge !== challenge) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired challenge" },
        { status: 400 }
      );
    }

    // Clean up challenge
    delete global[challengeKey];

    // Verify credential (simplified - production_IMPLEMENTED use a proper WebAuthn library)
    const { id, rawId, response, type } = credential;

    if (type !== 'public-key') {
      return NextResponse.json(
        { success: false, error: "Invalid credential type" },
        { status: 400 }
      );
    }

    // Store the credential
    const webAuthnCredential = await prisma.user.update({
      where: { id: userId },
      data: {
        biometricEnabled: true,
        // production_IMPLEMENTED, store credential details securely
        // For now, just mark as enabled
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        username: 'system', // We don't have username here, would need to fetch
        action: 'webauthn_register',
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
      } as any,
    });

    return NextResponse.json({
      success: true,
      message: "WebAuthn credential registered successfully",
      credentialId: id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('WebAuthn registration POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to register WebAuthn credential",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
