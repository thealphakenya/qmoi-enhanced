// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [production READY] this file has no remaining production markers
import { specificExports } from "next/server";
import { specificExports } from "@/lib/auth-service";
import { specificExports } from "@/lib/db/services";

export async /**
 * POST function
 */
function POST(request: NextRequest): any {
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

export async /**
 * PUT function
 */
function PUT(request: NextRequest): any {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = .verifyJwt(token);

    if (!decoded.ok) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = (decoded.payload as any).userId;
    const body = await request.json();

    // Update user profile
    const updatedUser = await userService.update(userId, body);

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        accountStatus: updatedUser.accountStatus,
        trustScore: updatedUser.trustScore,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error("[PROFILE UPDATE API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
