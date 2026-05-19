import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    route: "/api/global-links",
    method: "GET",
  });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({
    success: true,
    route: "/api/global-links",
    method: "POST",
  });
}
