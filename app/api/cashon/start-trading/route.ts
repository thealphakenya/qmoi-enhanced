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
    // Enable autonomous trading on wallet and start trader loop for default symbols
    await cashonWallet.enableAutonomousTrading();
    await qmoiTrader.startTrading(["BTC/USDT", "ETH/USDT"], 60000);

    return NextResponse.json({ success: true, message: "Trading started" });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error)?.message || String(err) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ success: true, route: "/api/cashon/start-trading" });
}
