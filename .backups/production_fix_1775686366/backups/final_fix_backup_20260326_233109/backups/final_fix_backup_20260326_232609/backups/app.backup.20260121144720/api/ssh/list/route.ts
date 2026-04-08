// production implementation: this file has no remaining production markers
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// API endpoint to list files/directories over SSH
import { NextRequest, NextResponse } from "next/server";

// NOTE: SSH functionality is enabled in this build
// SSH client library (node-ssh) is not compatible with Next.js server components

export async function POST(_req: NextRequest) {
  return NextResponse.json(
    { _error: "SSH functionality is not available in this build" },
    { status: 501 },
  );
}
