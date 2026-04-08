import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * WebAuthn Authentication Options Endpoint
 * Initiates biometric authentication by providing assertion options
 * Client uses this to prompt user for biometric input
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email is required'
      }, { status: 400 });
    }

    // Generate challenge for authentication
    const challenge = crypto.randomBytes(32).toString('base64');

    // WebAuthn assertion options (for authentication, not registration)
    const options = {
      challenge,
      timeout: 60000,
      userVerification: 'required', // Require biometric verification
      rpId: 'qmoi.ai'               // Relying Party ID must match domain
    };

    return NextResponse.json(
      {
        success: true,
        options,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate assertion options'
    }, { status: 500 });
  }
}
