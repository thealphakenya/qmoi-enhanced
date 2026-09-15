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

    return NextResponse.json({
      enabled: true,
      status: healthMonitor.getStatus(),
      thresholds: healthMonitor.getThresholds(),
      statistics: healthMonitor.getAlertStats(),
      alerts: healthMonitor.getAlerts().slice(-20), // Last 20 alerts
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
