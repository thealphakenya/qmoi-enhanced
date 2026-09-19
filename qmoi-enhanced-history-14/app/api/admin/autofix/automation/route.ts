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
      const manager = await initializeQMOIAutomation(config);
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
      const manager = await initializeQMOIAutomation(config);
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
