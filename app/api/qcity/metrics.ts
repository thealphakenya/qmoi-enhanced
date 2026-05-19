import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const now = new Date().toISOString();

  return NextResponse.json({
    success: true,
    lastUpdated: now,
    metrics: [
      { label: "Connected Nodes", value: 142, delta: "+2%", status: "good" },
      { label: "Active Services", value: 39, delta: "+1%", status: "good" },
      { label: "Open Alerts", value: 2, delta: "-33%", status: "good" },
      { label: "Incident Response", value: "3m 12s", delta: "-14%", status: "good" },
    ],
    summary: {
      availability: "99.98%",
      averageResponseTimeMs: 310,
      totalDevices: 142,
      onlineDevices: 139,
      offlineDevices: 3,
      health: "operational",
    },
  });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "QCity metrics endpoint accepts POST for future ingestion.",
  });
}
