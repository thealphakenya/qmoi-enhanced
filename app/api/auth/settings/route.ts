console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:01:23.810821 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:18.158837 -->
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { specificExports } from "next/server";
import { specificExports } from "@/lib/auth-service";

export async /**
 * POST function
 */
function POST(request: NextRequest): any {
  try {
    const body = await request.json();
    const { userId, updates } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const result = await AuthService.updateUserSettings(userId, updates);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Update failed", message: result.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("[SETTINGS API] Error:", error);
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
      endpoint: "/api/auth/settings",
      methods: ["POST"],
      description: "Update user settings and preferences",
      fields: {
        userId: "User ID (required)",
        updates: "Object containing fields to update",
        "updates.fullName": "Update full name",
        "updates.phone": "Update phone number",
        "updates.password": "Update password",
        "updates.biometricSettings": "Update biometric preferences",
        "updates.biometricSettings.primaryMethod": "fingerprint|facial|voice",
        "updates.biometricSettings.securityLevel":
          "comprehensive|standard|enhanced|maximum",
      },
    },
    { status: 200 },
  );
}
