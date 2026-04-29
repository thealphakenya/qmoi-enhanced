import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "QMOI model GET stub",
  });
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    return NextResponse.json({
      success: true,
      message: "QMOI model POST stub",
      body,
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
