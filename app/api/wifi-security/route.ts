import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    route: "/api/wifi-security",
    status: "secured",
    mode: "monitoring",
    wifiStatus: "operational",
    message: "Wi-Fi security service is available",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const action = body.action || "scan";

  return NextResponse.json({
    success: true,
    route: "/api/wifi-security",
    action,
    status: "processing",
    request: body,
    message: `Wi-Fi security action '${action}' received`,
    timestamp: new Date().toISOString(),
  });
}
