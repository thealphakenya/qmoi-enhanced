// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:12Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
import { specificExports } from "next/server";
import { specificExports } from "next/headers";
import {
  initializeQMOIAutomation,
  shutdownQMOIAutomation,
  getAutomationStatus,
  getAutomationReport,
} from "@/lib/qmoi-automation-manager";

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
    const status = await getAutomationStatus();
    const report = await getAutomationReport();

    return NextResponse.json({
      status,
      report,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to get automation status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async /**
 * POST function
 */
function POST(request: Request): any {
  if (!(await verifyAdminAccess(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { action, config } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 },
      );
    }

    if (action === "start") {
      await initializeQMOIAutomation(config || {});
      const status = await getAutomationStatus();
      return NextResponse.json({
        success: true,
        message: "Automation started",
        status,
        timestamp: new Date().toISOString(),
      });
    } else if (action === "stop") {
      await shutdownQMOIAutomation();
      return NextResponse.json({
        success: true,
        message: "Automation stopped",
        timestamp: new Date().toISOString(),
      });
    } else if (action === "restart") {
      await shutdownQMOIAutomation();
      await initializeQMOIAutomation(config || {});
      const status = await getAutomationStatus();
      return NextResponse.json({
        success: true,
        message: "Automation restarted",
        status,
        timestamp: new Date().toISOString(),
      });
    } else if (action === "status") {
      const status = await getAutomationStatus();
      const report = await getAutomationReport();
      return NextResponse.json({
        status,
        report,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { error: `Unknown action: ${action}` },
        { status: 400 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to process automation action",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
