import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { log } from '@/lib/logger';
import { getCredentialByEmail, updateWebAuthnCredentialLastUsed, verifyWebAuthnAssertion, consumeWebAuthnChallenge } from '@/lib/webauthn';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * WebAuthn Authentication Finish Endpoint
 * Completes biometric authentication after client provides assertion.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, assertion, challenge, consciousness_sync } = body;

    if (!email || !assertion || !challenge) {
      return NextResponse.json(
        { success: false, error: 'Email, assertion, and challenge are required' },
        { status: 400 },
      );
    }

    if (!consumeWebAuthnChallenge(email, 'authenticate', challenge)) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired challenge' },
        { status: 400 },
      );
    }

    const credential = await getCredentialByEmail(email);
    const verification = verifyWebAuthnAssertion(assertion, credential, challenge);

    if (!verification.valid) {
      return NextResponse.json(
        {
          success: false,
          error: 'WebAuthn verification failed',
          verification,
        },
        { status: 401 },
      );
    }

    if (credential) {
      await updateWebAuthnCredentialLastUsed(credential.credentialId);
    }

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresIn = 24 * 60 * 60; // seconds

    return NextResponse.json(
      {
        success: true,
        token: sessionToken,
        user: {
          email,
          id: crypto.createHash('sha256').update(email.toLowerCase()).digest('hex'),
          name: email.split('@')[0],
          biometric_verified: true,
          authentication_method: 'webauthn',
          created_at: new Date().toISOString(),
        },
        session: {
          token: sessionToken,
          expires_in: expiresIn,
          expires_at: new Date(Date.now() + expiresIn * 1000).toISOString(),
          secure: true,
          http_only: true,
          authentication_method: 'webauthn',
          device_verified: true,
        },
        verification: {
          signature_valid: !!verification.valid,
          counter_valid: verification.valid,
          security_level: verification.valid ? 'maximum' : 'low',
          reason: verification.reason,
        },
        consciousness: {
          validated: !!consciousness_sync,
          threat_detected: false,
          autonomous_approval: 'approved',
        },
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': `webauthn_session_token=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${expiresIn}`,
        },
      },
    );
  } catch (error) {
    const authError = error instanceof Error ? error : new Error(String(error));
    log.error('WebAuthn authentication finish error', authError);
    return NextResponse.json(
      {
        success: false,
        error: authError.message,
      },
      { status: 500 },
    );
  }
}
