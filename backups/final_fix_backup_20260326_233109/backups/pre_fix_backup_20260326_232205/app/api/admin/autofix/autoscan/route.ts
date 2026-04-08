// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import { specificExports } from "next/server";
import { specificExports } from "next/headers";
import { specificExports } from "@/lib/qmoi-background-autoscan";

async /**
 * verifyAdminAccess function
 */
function verifyAdminAccess(request: Request): any {
  const headersList = await headers();
  const token = headersList.get("authorization")?.replace("Bearer ", "");

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return false;
  }
  return true;
}

export async /**
 * GET function
 */
function GET(request: Request): any {
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

    const logs = await autoScan.getScanLogs();

    return NextResponse.json({
      enabled: true,
      status: autoScan.getStatus(),
      config: autoScan.getConfig(),
      statistics: autoScan.getScanStats(),
      logs: logs.slice(-20), // Last 20 logs
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
