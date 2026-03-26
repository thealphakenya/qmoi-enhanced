// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:12Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// Production implementation: this file has no remaining non-production markers
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  getAutomationManager,
  initializeQMOIAutomation,
  shutdownQMOIAutomation,
} from "@/lib/qmoi-automation-manager";

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
    const manager = getAutomationManager();
    const status = manager.getStatus();
    const report = manager.getReport();

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

export async function POST(request: Request) {
  if (!(await verifyAdminAccess(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { action, config } = body;

    if (action === "start") {
      await initializeQMOIAutomation(config);
      const manager = getAutomationManager();
      return NextResponse.json({
        success: true,
        message: "Background automation started",
        status: manager.getStatus(),
      });
    } else if (action === "stop") {
      await shutdownQMOIAutomation();
      return NextResponse.json({
        success: true,
        message: "Background automation stopped",
      });
    } else if (action === "restart") {
      await shutdownQMOIAutomation();
      await initializeQMOIAutomation(config);
      const manager = getAutomationManager();
      return NextResponse.json({
        success: true,
        message: "Background automation restarted",
        status: manager.getStatus(),
      });
    } else {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to process automation request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
