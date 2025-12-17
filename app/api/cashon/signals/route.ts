import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { qmoiTrader } from "@/lib/qmoi-trader";

// Verify master token
function verifyMasterToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  const masterToken = process.env.MASTER_TOKEN;

  return token === masterToken ? token : null;
}

// GET /api/cashon/signals
export async function GET(request: NextRequest) {
  try {
    const apiAuth = requireApiKey(request.headers);
    const masterToken = verifyMasterToken(request);
    if (!apiAuth.ok && !masterToken) {
      return NextResponse.json(
        apiAuth.response?.body || { error: "Master access required" },
        { status: apiAuth.response?.status || 401 },
      );
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const signals = qmoiTrader.getRecentSignals(limit);
    return NextResponse.json(signals);
  } catch (error) {
    console.error("Signals API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
