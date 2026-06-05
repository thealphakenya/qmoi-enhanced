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

export async function GET(req: NextRequest) {
  if (!isMaster(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const walletStatus = await cashonWallet.getTradingStatus();
    const traderStatus = qmoiTrader.getStatus?.() || {};

    return NextResponse.json({ success: true, walletStatus, traderStatus });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error)?.message || String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
