import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const now = new Date().toISOString();

  return NextResponse.json({
    success: true,
    lastChecked: now,
    serviceStatus: [
      { name: "Water Supply Control", status: "operational" },
      { name: "Transit Management", status: "operational" },
      { name: "Energy Grid Monitoring", status: "degraded" },
      { name: "Public Safety Sensors", status: "operational" },
    ],
    summary: {
      totalServices: 12,
      onlineServices: 11,
      offlineServices: 1,
      overallHealth: "operational",
      uptime: "99.98%",
      activeAlerts: 2,
      incidentSeverity: "low",
    },
    incidentReports: [
      {
        id: "IQ-921",
        category: "Grid Load",
        summary: "Power surge detected in sector 7",
        severity: "high",
      },
      {
        id: "IQ-913",
        category: "Traffic",
        summary: "Signal sync disruption on 5th Avenue",
        severity: "medium",
      },
    ],
  });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "QCity status endpoint accepts POST for future status updates.",
  });
}
