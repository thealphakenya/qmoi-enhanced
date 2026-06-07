import { NextRequest, NextResponse } from 'next/server';
import { log } from '@/lib/logger';
import { consumeWebAuthnChallenge, registerWebAuthnCredential } from '@/lib/webauthn';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * WebAuthn Registration Finish Endpoint
 * Completes biometric registration after client creates credential.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, credential, challenge } = body;

    if (!email || !credential || !challenge) {
      return NextResponse.json(
        { success: false, error: 'Email, credential, and challenge are required' },
        { status: 400 },
      );
    }

    if (!consumeWebAuthnChallenge(email, 'register', challenge)) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired challenge' },
        { status: 400 },
      );
    }

    const { id, publicKey, transports } = credential;

    if (!id || !publicKey) {
      return NextResponse.json(
        { success: false, error: 'Credential id and publicKey are required' },
        { status: 400 },
      );
    }

    const record = await registerWebAuthnCredential({
      email,
      credentialId: id,
      publicKey,
      transports,
      counter: credential.counter ?? 0,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'WebAuthn credential registered successfully',
        credential: {
          id: record.id,
          credentialId: record.credentialId,
          email: record.email,
          enrolledAt: record.enrolledAt,
          deviceType: 'platform_authenticator',
          transports: record.transports,
        },
        verification: {
          stored: true,
          securityLevel: 'high',
        },
        nextSteps: [
          'You can now sign in using WebAuthn biometric authentication',
          'Your device handles biometric data and private keys securely',
          'Challenge and credential data are stored only for verification',
        ],
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    const authError = error instanceof Error ? error : new Error(String(error));
    log.error('WebAuthn registration finish error', authError);
    return NextResponse.json(
      {
        success: false,
        error: authError.message,
      },
      { status: 500 },
    );
  }
}
