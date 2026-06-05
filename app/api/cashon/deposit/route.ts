import { NextRequest, NextResponse } from "next/server";
import { cashonWallet } from "@/lib/cashon-wallet";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isMaster(request: NextRequest): boolean {
  const auth = request.headers.get("authorization") || "";
  const token = auth.replace("Bearer ", "");
  return !!token && token === (process.env.MASTER_TOKEN || process.env.ADMIN_TOKEN);
}

export async function POST(req: NextRequest) {
  if (!isMaster(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json().catch(() => ({}));
    const amount = Number(body.amount || 0);
    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: "Invalid amount" }, { status: 400 });
    }

    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const txId = await cashonWallet.initiateDeposit(amount, token);
    return NextResponse.json({ success: true, transactionId: txId });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error)?.message || String(err) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ success: true, route: "/api/cashon/deposit" });
}
