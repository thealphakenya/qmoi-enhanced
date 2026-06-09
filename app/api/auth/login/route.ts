import type { NextRequest } from "next/server";
import * as signinRoute from "../signin/route";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Login endpoint - use POST to authenticate",
    method: "GET",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  return signinRoute.POST(req);
}
