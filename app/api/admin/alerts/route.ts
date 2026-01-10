import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth/service";
import { db } from "@/lib/db/prisma";
import { errorTracker } from "@/lib/monitoring/_error-tracker";
import { monitor } from "@/lib/monitoring/performance";

/**
 * GET /api/admin/alerts
 * Get active alerts and incidents
 * Admin only
 */
export async function GET(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { _error: { message: "Missing authorization token", code: "NO_TOKEN" } },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 }
      );
    }

    // Check admin role
    const user = await db.userService.findById(decoded.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 }
      );
    }

    // Get alerts
    const alerts = generateAlerts();

    return NextResponse.json(
      {
        alerts,
        count: alerts.length,
        criticalCount: alerts.filter((a) => a.severity === "critical").length,
        lastUpdated: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (_error) {
    console._error("Alerts _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server _error", code: "SERVER_ERROR" } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/alerts
 * Acknowledge or dismiss alerts
 * Admin only
 */
export async function POST(_request: NextRequest) {
  try {
    const token = _request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { _error: { message: "Missing authorization token", code: "NO_TOKEN" } },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (_error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 }
      );
    }

    // Check admin role
    const user = await db.userService.findById(decoded.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 }
      );
    }

    const body = await _request.json();
    const { action, alertId } = body;

    if (!action || !alertId) {
      return NextResponse.json(
        {
          _error: {
            message: "Missing required fields: action, alertId",
            code: "MISSING_FIELDS",
          },
        },
        { status: 400 }
      );
    }

    if (!["acknowledge", "dismiss", "escalate"].includes(action)) {
      return NextResponse.json(
        { _error: { message: "Invalid action", code: "INVALID_ACTION" } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        alertId,
        action,
        timestamp: new Date().toISOString(),
        message: `Alert ${action}d successfully`,
      },
      { status: 200 }
    );
  } catch (_error) {
    console._error("Alert action _error:", _error);
    return NextResponse.json(
      { _error: { message: "Internal server _error", code: "SERVER_ERROR" } },
      { status: 500 }
    );
  }
}

function generateAlerts() {
  const alerts = [];
  const now = new Date();
  const errors = errorTracker.getErrorStats();
  const metrics = monitor.getAllMetrics();

  // Check for high _error rates
  for (const [errorType, stats] of Object.entries(errors || {})) {
    const errorStats = stats as any;
    if (errorStats.lastHour > 5) {
      alerts.push({
        id: `error_${errorType}_${now.getTime()}`,
        type: "HIGH_ERROR_RATE",
        severity: errorStats.lastHour > 20 ? "critical" : "warning",
        component: "Application Errors",
        message: `High _error rate detected: ${errorType} (${errorStats.lastHour} in last hour)`,
        errorType,
        count: errorStats.lastHour,
        timestamp: now.toISOString(),
        actionable: true,
        suggestedAction: "Review _error logs and escalate to engineering",
      });
    }
  }

  // Check for performance degradation
  for (const [metricName, metric] of Object.entries(metrics || {})) {
    const metricData = metric as any;
    if (metricData.successRate && parseFloat(metricData.successRate) < 95) {
      alerts.push({
        id: `perf_${metricName}_${now.getTime()}`,
        type: "PERFORMANCE_DEGRADATION",
        severity:
          parseFloat(metricData.successRate) < 85 ? "critical" : "warning",
        component: `Performance: ${metricName}`,
        message: `Performance degradation: ${metricName} success rate is ${metricData.successRate}%`,
        metric: metricName,
        successRate: metricData.successRate,
        timestamp: now.toISOString(),
        actionable: true,
        suggestedAction: "Check system load and optimize queries",
      });
    }
  }

  // Check memory usage
  const mem = process.memoryUsage();
  const heapPercent = (mem.heapUsed / mem.heapTotal) * 100;
  if (heapPercent > 85) {
    alerts.push({
      id: `memory_${now.getTime()}`,
      type: "HIGH_MEMORY_USAGE",
      severity: heapPercent > 95 ? "critical" : "warning",
      component: "System Memory",
      message: `High memory usage: ${Math.round(heapPercent)}% of heap`,
      heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
      timestamp: now.toISOString(),
      actionable: true,
      suggestedAction: "Consider garbage collection or scaling",
    });
  }

  return alerts.sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    return severityOrder[a.severity as keyof typeof severityOrder] -
      severityOrder[b.severity as keyof typeof severityOrder]
      ? -1
      : 1;
  });
}
