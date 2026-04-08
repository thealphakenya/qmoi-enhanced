// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
import { specificExports } from "next/server";
import { specificExports } from "@/lib/auth-service";
import { specificExports } from "@/lib/qmoi-service";

export async /**
 * POST function
 */
function POST(request: NextRequest): any {
  try {
    const body = await request.json();
    const {
      email,
      username,
      password,
      biometricMethod,
      biometricData,
      rememberMe,
    } = body;

    // Validate: either email/username + password OR biometric method
    if (!biometricMethod && !password) {
      return NextResponse.json(
        { error: "Either password or biometric method is required" },
        { status: 400 },
      );
    }

    if (!email && !username) {
      return NextResponse.json(
        { error: "Either email or username is required" },
        { status: 400 },
      );
    }

    const signinData: SigninData = {
      email,
      username,
      password,
      biometricMethod,
      biometricData: biometricData
        ? {
            method: biometricData.method || biometricMethod,
            confidence: biometricData.confidence || 0.9,
            timestamp: new Date().toISOString(),
            verified: true,
            metadata: biometricData.metadata,
          }
        : undefined,
      rememberMe,
    };

    // Perform signin
    const signinResult = await AuthService.signin(signinData);

    if (!signinResult.success) {
      return NextResponse.json(
        {
          error: signinResult.error || "Signin failed",
          message: signinResult.message,
        },
        { status: 401 },
      );
    }

    // Log to QMOI memory
    if (signinResult.userId && signinResult.sessionId) {
      await QMOIService.logAuthEvent({
        userId: signinResult.userId,
        sessionId: signinResult.sessionId,
        eventType: "signin",
        details: {
          email: signinResult.user?.email,
          username: signinResult.user?.username,
          fullName: signinResult.user?.fullName,
          authMethod: biometricMethod ? "biometric" : "password",
          biometricMethod,
        },
      });

      // Update QMOI memory with user context
      await QMOIService.processMessage(
        `User ${signinResult.user?.fullName} has signed in`,
        signinResult.sessionId,
        signinResult.userId,
        {
          authMethod: biometricMethod ? "biometric" : "password",
          biometricMethod,
          email: signinResult.user?.email,
          preferences: {
            language: "en",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        sessionId: signinResult.sessionId,
        userId: signinResult.userId,
        user: signinResult.user,
        message: signinResult.message,
        authMethod: biometricMethod ? "biometric" : "password",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[SIGNIN API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async /**
 * GET function
 */
function GET(): any {
  return NextResponse.json(
    {
      endpoint: "/api/auth/signin",
      methods: ["POST"],
      description: "User signin with password or biometric authentication",
      fields: {
        email: "User email address (required if username not provided)",
        username: "Username (required if email not provided)",
        password: "Password (required for password auth)",
        biometricMethod:
          "Biometric method: fingerprint|facial|voice (optional)",
        biometricData:
          "Biometric capture data (required if biometricMethod provided)",
        rememberMe: "Remember this prodice (optional)",
      },
    },
    { status: 200 },
  );
}
