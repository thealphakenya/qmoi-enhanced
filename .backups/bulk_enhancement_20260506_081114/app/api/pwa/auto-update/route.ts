import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    version: "1.0.1",
    releaseNotes: "PWA auto-update endpoint is available.",
    autoApply: false,
    timestamp: new Date().toISOString(),
  });
}
