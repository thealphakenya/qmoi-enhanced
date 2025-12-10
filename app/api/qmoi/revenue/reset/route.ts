import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Verify master access
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Master access required" },
        { status: 401 }
      );
    }

    const masterKey = authHeader.substring(7);
    if (masterKey !== process.env.QMOI_MASTER_API_KEY) {
      return NextResponse.json(
        { error: "Invalid master key" },
        { status: 403 }
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
      { status: 500 }
    );
  }
}
