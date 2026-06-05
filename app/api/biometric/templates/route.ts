import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "Biometric templates endpoint is available.",
    path: "/api/biometric/templates",
    method: "GET",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { templateName, settings } = body || {};
    if (!templateName) {
      return NextResponse.json({ success: false, error: "Template name is required." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Biometric template received.",
      templateName,
      settings: settings || {},
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Invalid request payload.",
    }, { status: 400 });
  }
}
