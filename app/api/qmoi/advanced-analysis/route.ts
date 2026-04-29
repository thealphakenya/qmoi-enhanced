import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  return NextResponse.json({
    success: true,
    route: "${routeName}",
    method: "GET",
  });
}

export async function POST(_request: NextRequest) {
  return NextResponse.json({
    success: true,
    route: "${routeName}",
    method: "POST",
  });
}
