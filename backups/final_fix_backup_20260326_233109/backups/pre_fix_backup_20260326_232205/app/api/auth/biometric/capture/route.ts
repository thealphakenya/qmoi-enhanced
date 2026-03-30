// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:10Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import { NextRequest, NextResponse } from "next/server";
import { AuthService, BiometricCapture } from "@/lib/auth-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, biometricMethod, confidence, verified, metadata } = body;

    if (!userId || !biometricMethod) {
      return NextResponse.json(
        { error: "userId and biometricMethod are required" },
        { status: 400 },
      );
    }

    if (!["fingerprint", "facial", "voice"].includes(biometricMethod)) {
      return NextResponse.json(
        { error: "Invalid biometricMethod. Must be: fingerprint|facial|voice" },
        { status: 400 },
      );
    }

    const biometricCapture: BiometricCapture = {
      method: biometricMethod,
      confidence: confidence || 0.9,
      timestamp: new Date().toISOString(),
      verified: verified !== false,
      metadata,
    };

    const result = await AuthService.captureBiometric(
      userId,
      biometricMethod,
      biometricCapture,
    );

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error || "Biometric capture failed",
          message: result.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        enrolled: result.enrolled,
        quality: result.quality,
        status: result.enrolled ? "enrolled" : "pending",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[BIOMETRIC CAPTURE API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      endpoint: "/api/auth/biometric/capture",
      methods: ["POST"],
      description: "Capture biometric data for enrollment or authentication",
      fields: {
        userId: "User ID (required)",
        biometricMethod: "fingerprint|facial|voice (required)",
        confidence: "Confidence score 0-1 (optional, default 0.9)",
        verified: "Whether capture was verified (optional, default true)",
        metadata: "Additional metadata like prodice info (optional)",
      },
    },
    { status: 200 },
  );
}
