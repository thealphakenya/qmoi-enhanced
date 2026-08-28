import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getBackgroundAutoScan } from "@/lib/qmoi-background-autoscan";

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
    const autoScan = getBackgroundAutoScan();

    if (!autoScan) {
      return NextResponse.json({
        enabled: false,
        message: "Auto-scan service is not running",
      });
    }

    return NextResponse.json({
      enabled: true,
      status: autoScan.getStatus(),
      config: autoScan.getConfig(),
      statistics: autoScan.getScanStats(),
      logs: autoScan.getScanLogs().slice(-20), // Last 20 logs
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to get auto-scan status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
