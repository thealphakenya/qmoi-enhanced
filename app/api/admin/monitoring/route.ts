import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth/service";
import { db } from "@/lib/db/prisma";
import { monitor } from "@/lib/monitoring/performance";
import { errorTracker } from "@/lib/monitoring/error-tracker";

/**
 * GET /api/admin/monitoring
 * Get comprehensive monitoring dashboard data
 * Admin only
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: { message: "Missing authorization token", code: "NO_TOKEN" } },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 }
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          error: {
            message: "Invalid token (missing userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 }
      );
    }

    // Check admin role
    const user = await db.userService.findById(String(decoded.userId));
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 }
      );
    }

    // Gather monitoring data
    const monitoring = {
      timestamp: new Date().toISOString(),
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version,
        platform: process.platform,
      },
      performance: monitor.getAllMetrics(),
      errors: errorTracker.getErrorStats(),
      database: {
        status: "healthy",
      },
      application: {
        environment: process.env.NODE_ENV,
        version: "2.0.0",
      },
    };

    // Add health score
    const healthScore = calculateHealthScore(monitoring);

    return NextResponse.json(
      {
        monitoring: {
          ...monitoring,
          healthScore,
          status:
            healthScore > 80
              ? "healthy"
              : healthScore > 50
              ? "degraded"
              : "critical",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Monitoring error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 }
    );
  }
}

function calculateHealthScore(monitoring: any): number {
  let score = 100;

  // Check memory usage
  const heapUsedMB = Math.round(
    monitoring.system.memory.heapUsed / 1024 / 1024
  );
  if (heapUsedMB > 500) {
    score -= 10; // High memory usage
  }

  // Check errors
  const totalErrors = (Object.values(monitoring.errors || {}) as any[]).reduce(
    (sum: number, _err: any) => sum + (_err.count || 0),
    0
  );
  if (totalErrors > 10) {
    score -= Math.min(30, totalErrors);
  }

  // Check performance
  const metrics = Object.values(monitoring.performance || {}) as any[];
  const failedMetrics = metrics.filter(
    (m: any) => m && parseFloat(m.successRate) < 95
  );
  if (failedMetrics.length > 0) {
    score -= failedMetrics.length * 5;
  }

  return Math.max(0, score);
}
