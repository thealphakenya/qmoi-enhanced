import { NextRequest, NextResponse } from "next/server";
import { authService } from "../../../../lib/auth/service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, username, password, biometricMethod, biometricData, rememberMe } = body;

    if ((!email && !username) || (!password && !biometricData)) {
      return NextResponse.json(
        { success: false, message: "Email/username and password or biometric data are required" },
        { status: 400 }
      );
    }

    const identifier = email || username || '';
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    let authResult;

    if (password) {
      authResult = await authService.authenticatePassword(identifier, password);
    } else if (biometricMethod && biometricData && username) {
      authResult = await authService.verifyBiometric(
        username,
        biometricMethod,
        biometricData,
      );
    }

    if (!authResult || !authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult?.message || "Authentication failed", error: authResult?.error },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: authResult.user,
      tokens: authResult.tokens,
      message: authResult.message || "Signin successful",
    });

    const isSecureCookie =
      req.nextUrl?.protocol === 'https' ||
      req.headers.get('x-forwarded-proto') === 'https' ||
      process.env.NODE_ENV === 'production';
    const sameSiteMode = isSecureCookie ? 'none' : 'lax';

    response.cookies.set('accessToken', authResult.tokens.accessToken, {
      httpOnly: true,
      secure: isSecureCookie,
      sameSite: sameSiteMode,
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    if (authResult.tokens.refreshToken) {
      response.cookies.set('refreshToken', authResult.tokens.refreshToken, {
        httpOnly: true,
        secure: isSecureCookie,
        sameSite: sameSiteMode,
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
