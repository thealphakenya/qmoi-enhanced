import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "jobId is required to stop auto-fix" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      status: "stop-requested",
      jobId,
      message: "Auto-fix stop requested successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to process request",
      },
      { status: 500 },
    );
  }
}
