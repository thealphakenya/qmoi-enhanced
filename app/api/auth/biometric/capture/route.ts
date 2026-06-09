import { NextRequest, NextResponse } from "next/server";
import { authService } from "../../../../lib/auth/service";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    route: "/api/auth/biometric/capture",
    method: "GET",
    message: "Use POST to enroll biometric data.",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      biometricMethod,
      confidence,
      verified = true,
      metadata,
    } = body;

    if (!userId || !biometricMethod || typeof confidence !== "number") {
      return NextResponse.json(
        {
          success: false,
          error: "Missing biometric enrollment payload",
          message: "userId, biometricMethod, and confidence are required.",
        },
        { status: 400 },
      );
    }

    const result = await authService.captureBiometric(userId, biometricMethod, {
      confidence,
      verified,
      metadata,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Biometric capture failed",
          message: result.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      enrolled: result.enrolled,
      quality: result.quality,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Biometric capture failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Biometric capture failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
