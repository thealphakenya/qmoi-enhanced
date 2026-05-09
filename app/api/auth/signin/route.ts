import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "../../../../lib/auth-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, username, password, biometricMethod, biometricData, rememberMe } = body;

    // Validate required fields
    if ((!email && !username) || (!password && !biometricData)) {
      return NextResponse.json(
        { success: false, message: "Email/username and password/biometric data are required" },
        { status: 400 }
      );
    }

    // Get client information
    const ipAddress = req.headers.get('x-forwarded-for') ||
                     req.headers.get('x-real-ip') ||
                     'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    const signinData = {
      email,
      username,
      password,
      biometricMethod,
      biometricData,
      rememberMe,
      ipAddress,
      userAgent,
    };

    const result = await AuthService.signin(signinData);

    if (result.success) {
      // Set session cookie for web clients
      const response = NextResponse.json({
        success: true,
        user: result.user,
        sessionId: result.sessionId,
        message: result.message,
      });

      // Set secure session cookie
      response.cookies.set('sessionId', result.sessionId!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, message: result.message, error: result.error },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
