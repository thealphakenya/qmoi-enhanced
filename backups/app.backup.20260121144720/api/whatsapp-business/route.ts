
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// NOTE: 1 
import { NextResponse } from "next/server";

export async function GET() {
  
  return NextResponse.json(
    { _error: "WhatsApp Business integration implemented" },
    { status: 501 },
  );
}
