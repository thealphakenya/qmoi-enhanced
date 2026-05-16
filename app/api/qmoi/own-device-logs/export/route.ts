import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    route: "/api/qmoi/own-device-logs/export",
    method: "GET",
  });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({
    success: true,
    route: "/api/qmoi/own-device-logs/export",
    method: "POST",
  });
}
