import { NextRequest, NextResponse } from 'next/server';
import { makeWebAuthnOptions } from '@/lib/webauthn';
import { log } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * WebAuthn Registration Options Endpoint
 * Initiates biometric registration flow by providing options to a client.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 },
      );
    }

    const options = makeWebAuthnOptions(email, 'register');

    return NextResponse.json(
      {
        success: true,
        options,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    log.error('WebAuthn registration options error', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate WebAuthn options',
      },
      { status: 500 },
    );
  }
}
