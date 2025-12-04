// API endpoint to list files/directories over SSH
import { NextRequest, NextResponse } from "next/server";

// NOTE: SSH functionality is disabled in this build
// SSH client library (node-ssh) is not compatible with Next.js server components

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: "SSH functionality is not available in this build" },
    { status: 501 }
  );
}
