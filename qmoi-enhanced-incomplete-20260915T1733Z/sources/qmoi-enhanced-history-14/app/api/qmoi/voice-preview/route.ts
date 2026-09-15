/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  try {
    const body = (await _req.json()) as any;
    return NextResponse.json({
      message: "Voice preview endpoint",
      status: "operational",
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: "Invalid request",
      },
      { status: 400 },
    );
  }
}
