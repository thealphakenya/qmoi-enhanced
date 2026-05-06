import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      status: "unknown",
    });
  } catch (_error){
    return NextResponse.json(
      {
        _error: _error instanceof Error ? _error.message : "Unknown _error",
      },
      { status: 500 },
    );
  }
}
