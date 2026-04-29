import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(_request: NextRequest) {
  return NextResponse.json({
    success: true,
    status: "stop-requested",
    message: "Auto-fix stop endpoint stub",
  });
}
