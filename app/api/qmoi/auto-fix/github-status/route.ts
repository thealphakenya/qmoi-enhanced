import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      status: "configured",
    });
  } catch (error) {
    return NextResponse.json(
      {
        _error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
