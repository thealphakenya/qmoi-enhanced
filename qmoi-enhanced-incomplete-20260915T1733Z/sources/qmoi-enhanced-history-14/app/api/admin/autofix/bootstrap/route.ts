import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  readBootstrapLogs,
  clearBootstrapLogs,
  getInitializationStatus,
} from "@/lib/qmoi-bootstrap";

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
    const status = getInitializationStatus();
    const logs = readBootstrapLogs(50); // Get last 50 logs

    return NextResponse.json({
      status,
      logs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to read bootstrap logs",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAdminAccess(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    clearBootstrapLogs();

    return NextResponse.json({
      success: true,
      message: "Bootstrap logs cleared",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to clear bootstrap logs",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
