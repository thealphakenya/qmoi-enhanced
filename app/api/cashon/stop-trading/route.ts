import { NextRequest, NextResponse } from "next/server";
import { cashonWallet } from "@/lib/cashon-wallet";
import qmoiTrader from "@/lib/qmoi-trader";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isMaster(request: NextRequest): boolean {
  const auth = request.headers.get("authorization") || "";
  const token = auth.replace("Bearer ", "");
  return !!token && token === (process.env.MASTER_TOKEN || process.env.ADMIN_TOKEN);
}

export async function POST(req: NextRequest) {
  if (!isMaster(req)) {
    return NextResponse.json({ error: "Unauthorized: master token required" }, { status: 401 });
  }

  try {
    await cashonWallet.disableAutonomousTrading();
    await qmoiTrader.stopTrading();

    return NextResponse.json({ success: true, message: "Trading stopped" });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error)?.message || String(err) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ success: true, route: "/api/cashon/stop-trading" });
}
