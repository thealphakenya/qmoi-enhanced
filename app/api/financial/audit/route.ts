/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
/* global Request, Headers, Buffer, URLSearchParams, TextDecoder, TextEncoder */
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

export async function GET() {
  try {
    const data = fs.readFileSync("logs/financial_verification.log", "utf-8");
    const lines = data.split("\n").filter(Boolean);
    return NextResponse.json({ success: true, logs: lines });
  } catch (_e) {
    const errorMessage = _e instanceof Error ? _e.message : String(_e);
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
