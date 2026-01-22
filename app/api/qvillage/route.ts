/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json({
    message: "QVillage API endpoint",
    status: "operational",
  });
}

export async function POST(_req: NextRequest) {
  try {
    const body = (await _req.json()) as any;
    return NextResponse.json({
      message: "QVillage endpoint processed",
      status: "success",
    });
  } catch (_e) {
    return NextResponse.json(
      {
        error: "Invalid request",
      },
      { status: 400 },
    );
  }
}
