import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/auth/service";
import { logAuthEvent } from "@/app/lib/auth/memory";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, username, password, biometricMethod, biometricData } = body;

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

    response.cookies.set('accessToken', authResult.tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    if (authResult.tokens.refreshToken) {
      response.cookies.set('refreshToken', authResult.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });
    }

    // Log signin event to QMOI memory for audit and session awareness
    try {
      await logAuthEvent({ userId: authResult.user?.id, role: authResult.user?.role, displayName: authResult.user?.displayName, event: 'signin', details: { ipAddress, userAgent } });
    } catch (e) {
      console.warn('Signin audit event failed', e);
    }

    return response;
  } catch (error) {
    console.error?.("Signin error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
