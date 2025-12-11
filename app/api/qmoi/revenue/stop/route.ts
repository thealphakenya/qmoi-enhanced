import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: any = mod.qmoiRevenueEngine || mod.default || mod;

    const result = qmoiRevenueEngine.stopRevenueEngine
      ? await qmoiRevenueEngine.stopRevenueEngine()
      : { success: false, message: "stopRevenueEngine not implemented" };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Stop revenue engine error:", error);
    return NextResponse.json(
      { error: "Failed to stop revenue engine" },
      { status: 500 }
    );
  }
}
