import { NextResponse } from "next/server";

export async function POST(_request: Request) {
  try {
    return NextResponse.json({
      success: true,
      message: "QMOI auto-setup stub endpoint",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Auto-setup failed",
      },
      { status: 500 },
    );
  }
}

export async function GET(_request: Request) {
  try {
    return NextResponse.json({
      success: true,
      status: "auto-setup stub",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
