import { NextRequest, NextResponse } from "next/server";
import qmoiTrader from "@/lib/qmoi-trader";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const signals = qmoiTrader.getRecentSignals?.(20) || [];
    return NextResponse.json({ success: true, signals });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error)?.message || String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const symbols = body.symbols || ["BTC/USDT", "ETH/USDT"];
    const generated = await qmoiTrader.generateTradingSignals(symbols);
    return NextResponse.json({ success: true, generated });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error)?.message || String(err) }, { status: 500 });
  }
}
