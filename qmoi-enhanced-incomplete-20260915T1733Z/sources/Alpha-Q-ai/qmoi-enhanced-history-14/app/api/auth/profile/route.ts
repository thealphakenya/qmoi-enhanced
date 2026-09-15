import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const { auth, biometric } = await AuthService.getUserProfile(userId);

    if (!auth) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        profile: {
          auth: {
            userId: auth.userId,
            email: auth.email,
            username: auth.username,
            fullName: auth.fullName,
            phone: auth.phone,
            dateOfBirth: auth.dateOfBirth,
            createdAt: auth.createdAt,
            lastLoginAt: auth.lastLoginAt,
            lastLoginMethod: auth.lastLoginMethod,
            emailVerified: auth.emailVerified,
            phoneVerified: auth.phoneVerified,
            isActive: auth.isActive,
          },
          biometric: biometric
            ? {
                userId: biometric.userId,
                fingerprint: biometric.biometrics.fingerprint
                  ? {
                      enrolled: biometric.biometrics.fingerprint.enrolled,
                      quality: biometric.biometrics.fingerprint.quality,
                      lastUsed: biometric.biometrics.fingerprint.lastUsed,
                      captureCount:
                        biometric.biometrics.fingerprint.captures.length,
                    }
                  : null,
                facial: biometric.biometrics.facial
                  ? {
                      enrolled: biometric.biometrics.facial.enrolled,
                      quality: biometric.biometrics.facial.quality,
                      lastUsed: biometric.biometrics.facial.lastUsed,
                      captureCount: biometric.biometrics.facial.captures.length,
                    }
                  : null,
                voice: biometric.biometrics.voice
                  ? {
                      enrolled: biometric.biometrics.voice.enrolled,
                      quality: biometric.biometrics.voice.quality,
                      lastUsed: biometric.biometrics.voice.lastUsed,
                      captureCount: biometric.biometrics.voice.captures.length,
                    }
                  : null,
                primaryMethod: biometric.primaryMethod,
                backupMethods: biometric.backupMethods,
                securityLevel: biometric.securityLevel,
              }
            : null,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[PROFILE API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      endpoint: "/api/auth/profile",
      methods: ["POST"],
      description: "Get user profile with auth and biometric details",
      fields: {
        userId: "User ID (required)",
      },
    },
    { status: 200 },
  );
}
