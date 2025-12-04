import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

export async function GET() {
  try {
    const data = fs.readFileSync("logs/whatsapp_verification.log", "utf-8");
    const lines = data.split("\n").filter(Boolean);
    return NextResponse.json({ success: true, logs: lines });
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, error: errorMsg });
  }
}
