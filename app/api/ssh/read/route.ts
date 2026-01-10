/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
/* global Request, Headers, Buffer, URLSearchParams, TextDecoder, TextEncoder */
// API endpoint to read a file over SSH
import { NextRequest, NextResponse } from "next/server";

// NOTE: SSH functionality is disabled in this build
// SSH client library (node-ssh) is not compatible with Next.js server components

export async function POST(_req: NextRequest) {
  return NextResponse.json(
    { error: "SSH functionality is not available in this build" },
    { status: 501 },
  );
}
