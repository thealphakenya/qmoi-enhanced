import { NextRequest, NextResponse } from "next/server";
import { qmoiRevenueEngine } from "../../../../../lib/qmoi-revenue-engine";

export async function POST(request: NextRequest) {
  try {
    // Verify master access
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Master access required" },
        { status: 401 },
      );
    }

    const masterKey = authHeader.substring(7);
    if (masterKey !== process.env.QMOI_MASTER_API_KEY) {
      return NextResponse.json(
        { error: "Invalid master key" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { type, amount } = body;

    if (!type || !amount) {
      return NextResponse.json(
        { error: "Type and amount are required" },
        { status: 400 },
      );
    }

    // Enable master mode and execute command
    qmoiRevenueEngine.setMasterMode(true);
    const result = await qmoiRevenueEngine.executeMasterCommand("set_target", {
      type,
      amount,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Set target error:", error);
    return NextResponse.json(
      { error: "Failed to set target" },
      { status: 500 },
    );
  }
}
