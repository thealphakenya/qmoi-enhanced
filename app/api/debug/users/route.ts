import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const allowDebug = process.env.ENABLE_DEBUG_ROUTES === "true" || process.env.NODE_ENV !== "production";

export async function GET(req: NextRequest) {
  if (!allowDebug) {
    return NextResponse.json(
      { success: false, error: "Debug endpoints are disabled in production." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    route: "/api/debug/users",
    method: "GET",
  });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({
    success: true,
    route: "/api/debug/users",
    method: "POST",
  });
}
