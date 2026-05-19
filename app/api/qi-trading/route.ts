import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    route: "/api/qi-trading",
    status: "available",
    supportedActions: ["quote", "execute", "status"],
    message: "QMOI Quantum Intelligence trading endpoint is ready",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const action = body.action || "execute";

  return NextResponse.json({
    success: true,
    route: "/api/qi-trading",
    action,
    status: "accepted",
    payload: body,
    message: `Trading request received for action ${action}`,
    timestamp: new Date().toISOString(),
  });
}
