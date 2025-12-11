import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(request.headers);
    const authHeader = request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      return NextResponse.json(
        apiAuth.response?.body || { error: "Master access required" },
        { status: apiAuth.response?.status || 401 }
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: any = mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
      ? qmoiRevenueEngine.getTransactions(50)
      : [];

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Get transactions error:", error);
    return NextResponse.json(
      { error: "Failed to get transactions" },
      { status: 500 }
    );
  }
}
