import { NextRequest, NextResponse } from "next/server";
import { cashonWallet } from "@/lib/cashon-wallet";

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
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const balance = await cashonWallet.getBalance(token);
    return NextResponse.json({ success: true, balance });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error)?.message || String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Support actions like sync-mpesa
  if (!isMaster(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json().catch(() => ({}));
    if (body.action === "sync-mpesa") {
      const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
      // Use public API to trigger balance refresh
      await cashonWallet.getBalance(token).catch(() => undefined);
      return NextResponse.json({ success: true, message: "MPesa sync requested" });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error)?.message || String(err) }, { status: 500 });
  }
}
