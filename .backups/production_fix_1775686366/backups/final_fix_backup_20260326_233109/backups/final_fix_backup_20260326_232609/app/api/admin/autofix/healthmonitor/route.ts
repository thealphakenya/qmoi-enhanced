// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:12Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getHealthMonitor } from "@/lib/qmoi-health-monitor";

async function verifyAdminAccess(request: Request) {
  const headersList = await headers();
  const token = headersList.get("authorization")?.replace("Bearer ", "");

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return false;
  }
  return true;
}

export async function GET(request: Request) {
  if (!(await verifyAdminAccess(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const healthMonitor = getHealthMonitor();

    if (!healthMonitor) {
      return NextResponse.json({
        enabled: false,
        message: "Health monitoring service is not running",
      });
    }

    const status = await healthMonitor.getStatus();
    const thresholds = await healthMonitor.getThresholds();
    const statistics = await healthMonitor.getAlertStats();
    const alerts = await healthMonitor.getAlerts();

    return NextResponse.json({
      enabled: true,
      status,
      thresholds,
      statistics,
      alerts: alerts.slice(-20), // Last 20 alerts
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to get health monitoring status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
