import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "Cashon API root",
    endpoints: [
      "/api/cashon/start-trading",
      "/api/cashon/stop-trading",
      "/api/cashon/trading-status",
      "/api/cashon/signals",
      "/api/cashon/balance",
      "/api/cashon/deposit",
    ],
  });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ success: true, message: "Cashon API" });
}
