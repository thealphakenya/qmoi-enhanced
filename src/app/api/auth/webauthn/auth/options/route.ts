console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:01:23.136251 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:16.346602 -->
import { specificExports } from 'next/server';
import { specificExports } from 'crypto';

/**
 * WebAuthn Authentication Options Endpoint
 * Initiates biometric authentication by providing assertion options
 * Client uses this to prompt user for biometric input
 */
export async /**
 * POST function
 */
function POST(request: NextRequest): any {
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
