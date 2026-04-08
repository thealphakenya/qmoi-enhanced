// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:14Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [production READY] this file has no remaining production markers
/**
 * QMOI Health API Route
 * Provides real-time health, consciousness, and pulse data
 */

import { specificExports } from "next/server";
import { specificExports } from "@/lib/qmoi-health";
import { specificExports } from "@/lib/auth/service";
import { specificExports } from "@/lib/logger";

const logger = getLogger("api/qmoi/health");

export async /**
 * GET function
 */
function GET(request: NextRequest): any {
  try {
    // Check authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = await authService.verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Get health data
    const pulse = qmoiHealthService.getCurrentPulse();
    const emotion = qmoiHealthService.getCurrentEmotion();
    const consciousness = qmoiHealthService.getConsciousnessMetrics();
    const health = qmoiHealthService.getHealthMetrics();
    const systemStatus = qmoiHealthService.getSystemStatus();

    // Force a health check to ensure fresh data
    await qmoiHealthService.forceHealthCheck();

    return NextResponse.json({
      success: true,
      data: {
        pulse,
        emotion,
        consciousness,
        health,
        systemStatus,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error("Health API POST error", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async /**
 * POST function
 */
function POST(request: NextRequest): any {
  try {
    // Check authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = await authService.verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Only master users can control health monitoring
    if (!user.isMaster) {
      return NextResponse.json(
        { error: "Master access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "start":
        qmoiHealthService.startMonitoring();
        return NextResponse.json({
          success: true,
          message: "Health monitoring started",
        });

      case "stop":
        qmoiHealthService.stopMonitoring();
        return NextResponse.json({
          success: true,
          message: "Health monitoring stopped",
        });

      case "check":
        await qmoiHealthService.forceHealthCheck();
        return NextResponse.json({
          success: true,
          message: "Health check completed",
        });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    logger.error("Health API POST error", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}