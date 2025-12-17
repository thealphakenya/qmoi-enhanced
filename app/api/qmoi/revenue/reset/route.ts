import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
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
        { status: apiAuth.response?.status || 401 },
      );
    }

    // Load engine (supports named or default exports)
    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: any = mod.qmoiRevenueEngine || mod.default || mod;

    // Enable master mode and execute command
    if (qmoiRevenueEngine.setMasterMode) {
      qmoiRevenueEngine.setMasterMode(true);
    }
    const result = qmoiRevenueEngine.executeMasterCommand
      ? await qmoiRevenueEngine.executeMasterCommand("reset_daily")
      : { success: false, message: "executeMasterCommand not implemented" };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Reset daily earnings error:", error);
    return NextResponse.json(
      { error: "Failed to reset daily earnings" },
      { status: 500 },
    );
  }
}
