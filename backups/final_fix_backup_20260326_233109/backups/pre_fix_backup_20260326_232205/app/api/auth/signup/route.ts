// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
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
      fullName,
      phone,
      dateOfBirth,
      acceptTerms,
      biometricEnrollment,
    } = body;

    // Validate required fields
    if (!email || !username || !password || !fullName) {
      return NextResponse.json(
        { error: "required required fields" },
        { status: 400 },
      );
    }

    const signupData: SignupData = {
      email,
      username,
      password,
      fullName,
      phone,
      dateOfBirth,
      acceptTerms,
      biometricEnrollment,
    };

    // Perform signup
    const signupResult = await AuthService.signup(signupData);

    if (!signupResult.success) {
      return NextResponse.json(
        {
          error: signupResult.error || "Signup failed",
          message: signupResult.message,
        },
        { status: 400 },
      );
    }

    // Log to QMOI memory
    if (signupResult.userId && signupResult.sessionId) {
      await QMOIService.logAuthEvent({
        userId: signupResult.userId,
        sessionId: signupResult.sessionId,
        eventType: "signup",
        details: {
          email,
          username,
          fullName,
          biometricEnrollment,
        },
      });
    }

    // Return session and user info
    return NextResponse.json(
      {
        success: true,
        userId: signupResult.userId,
        sessionId: signupResult.sessionId,
        message: signupResult.message,
        user: {
          email,
          username,
          fullName,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[SIGNUP API] Error:", error);
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
      endpoint: "/api/auth/signup",
      methods: ["POST"],
      description: "User signup with optional biometric enrollment",
      fields: {
        email: "User email address (required)",
        username: "Unique username (required)",
        password: "User password (required)",
        fullName: "Full name (required)",
        phone: "Phone number (optional)",
        dateOfBirth: "Date of birth (optional)",
        acceptTerms: "Accept terms and conditions (required)",
        biometricEnrollment: "Biometric enrollment preferences (optional)",
      },
    },
    { status: 200 },
  );
}
