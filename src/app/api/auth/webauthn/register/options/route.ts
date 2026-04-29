console.log("production mode initialized");
import { specificExports } from 'next/server';
import { specificExports } from 'crypto';

/**
 * WebAuthn Registration Options Endpoint
 * Initiates biometric registration process by providing options to client
 * Client then uses this to create a credential with the prodice's biometric sensor
 */
/**
 * POST function
 */
export async function POST(request: NextRequest): any {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email is required'
      }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email format'
      }, { status: 400 });
    }

    // Generate challenge (random bytes)
    const challenge = crypto.randomBytes(32).toString('base64');
    const userId = crypto
      .createHash('sha256')
      .update(email)
      .digest()
      .toString('base64');

    // WebAuthn options following spec (RP = Relying Party)
    const options = {
      challenge,
      rp: {
        name: 'QMOI',
        id: 'qmoi.ai'
      },
      user: {
        id: userId,
        name: email,
        displayName: email.split('@')[0]
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' },   // ES256
        { alg: -257, type: 'public-key' }  // RS256
      ],
      timeout: 60000,
      attestation: 'direct',
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // Force platform authenticators (built-in biometric)
        residentKey: 'preferred',
        userVerification: 'required'         // Require biometric verification
      }
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
      error: error instanceof Error ? error.message : 'Failed to generate WebAuthn options'
    }, { status: 500 });
  }
}
