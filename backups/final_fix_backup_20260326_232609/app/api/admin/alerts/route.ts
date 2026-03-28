// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:12Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { NextRequest, NextResponse } from "next/server";
import authService from "@/lib/auth/service";
import { db } from "@/lib/db/prisma";
import { errorTracker } from "@/lib/monitoring/error-tracker";
import { monitor } from "@/lib/monitoring/performance";

interface Alert {
  id: string;
  type: string;
  title: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical" | "warning";
  category: string;
  timestamp: string;
  acknowledged: boolean;
  [key: string]: any; // Allow additional alert-specific metadata
}

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
        {
          _error: { message: "required authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    // At this point, decoded is guaranteed to be non-null
    const tokenData = decoded as { userId: string };

    // Check admin role
    const user = await db.userService.findById(tokenData.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
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
      { status: 200 },
    );
  } catch (error) {
    (globalThis.console as any)?.error?.("Alerts _error:", error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
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
        {
          _error: { message: "required authorization token", code: "NO_TOKEN" },
        },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = authService.verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { _error: { message: "Invalid token", code: "INVALID_TOKEN" } },
        { status: 401 },
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          _error: {
            message: "Invalid token (required userId)",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      );
    }

    // Check admin role
    const user = await db.userService.findById(decoded.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { _error: { message: "Insufficient permissions", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const body = await _request.json();
    const { action, alertId } = body;

    if (!action || !alertId) {
      return NextResponse.json(
        {
          _error: {
            message: "required required fields: action, alertId",
            code: "MISSING_FIELDS",
          },
        },
        { status: 400 },
      );
    }

    if (!["acknowledge", "dismiss", "escalate"].includes(action)) {
      return NextResponse.json(
        { _error: { message: "Invalid action", code: "INVALID_ACTION" } },
        { status: 400 },
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
      { status: 200 },
    );
  } catch (error) {
    (globalThis.console as any)?.error?.("Alert action _error:", error);
    return NextResponse.json(
      { _error: { message: "Internal server error", code: "SERVER_ERROR" } },
      { status: 500 },
    );
  }
}

function generateAlerts(): Alert[] {
  const alerts: Alert[] = [];
  const now = new Date();
  const errorStats = errorTracker.getErrorStats();
  const metrics = monitor.getRequestMetrics();

  // Check for high error rates - use error stats
  if (errorStats.total > 10) {
    alerts.push({
      id: `error_high_${now.getTime()}`,
      type: "HIGH_ERROR_RATE",
      title: "High Error Rate Detected",
      category: "system",
      severity: errorStats.total > 50 ? "critical" : "warning",
      component: "Application Errors",
      message: `High error rate detected: ${errorStats.total} errors logged`,
      count: errorStats.total,
      timestamp: now.toISOString(),
      acknowledged: false,
      actionable: true,
      suggestedAction: "Review error logs and escalate to engineering",
    });
  }

  // Check for performance degradation based on metrics
  if (metrics && metrics.length > 0) {
    const avgResponseTime =
      metrics.reduce((sum: number, m: any) => sum + (m.duration || 0), 0) /
      metrics.length;
    if (avgResponseTime > 1000) {
      alerts.push({
        id: `perf_response_${now.getTime()}`,
        type: "PERFORMANCE_DEGRADATION",
        title: "API Performance Degradation",
        category: "performance",
        severity: avgResponseTime > 5000 ? "critical" : "warning",
        component: "API Response Times",
        message: `High response times detected: avg ${Math.round(avgResponseTime)}ms`,
        responseTime: Math.round(avgResponseTime),
        timestamp: now.toISOString(),
        acknowledged: false,
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
      title: "High Memory Usage",
      category: "performance",
      severity: heapPercent > 95 ? "critical" : "warning",
      component: "System Memory",
      message: `High memory usage: ${Math.round(heapPercent)}% of heap`,
      heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
      timestamp: now.toISOString(),
      acknowledged: false,
      actionable: true,
      suggestedAction: "Consider garbage collection or scaling",
    });
  }

  return alerts.sort((a: any, b: any) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    const aOrder = severityOrder[a.severity as keyof typeof severityOrder] ?? 2;
    const bOrder = severityOrder[b.severity as keyof typeof severityOrder] ?? 2;
    return aOrder - bOrder;
  });
}
