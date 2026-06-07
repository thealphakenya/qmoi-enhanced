import { NextRequest, NextResponse } from 'next/server';
import { getCredentialByEmail, makeWebAuthnOptions } from '@/lib/webauthn';
import { log } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * WebAuthn Authentication Options Endpoint
 * Initiates biometric authentication by providing assertion options.
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

    const credential = await getCredentialByEmail(email);
    if (!credential) {
      return NextResponse.json(
        { success: false, error: 'No WebAuthn credential registered for this user' },
        { status: 404 },
      );
    }

    const options = makeWebAuthnOptions(email, 'authenticate');

    return NextResponse.json(
      {
        success: true,
        options,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    const authError = error instanceof Error ? error : new Error(String(error));
    log.error('WebAuthn authentication options error', authError);
    return NextResponse.json(
      {
        success: false,
        error: authError.message,
      },
      { status: 500 },
    );
  }
}
