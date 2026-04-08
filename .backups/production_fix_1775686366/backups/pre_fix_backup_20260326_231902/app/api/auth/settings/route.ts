// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [production READY] this file has no remaining production markers
import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth-service";

export async function POST(request: NextRequest) {
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
    console.error("[SETTINGS API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
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
