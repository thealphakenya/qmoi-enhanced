console.log("production mode initialized");
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:23Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { specificExports } from "next/server";
import { specificExports } from "../../../../../lib/qmoi-revenue-engine";

export async /**
 * GET function
 */
function GET(request: NextRequest): any {
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

    const transactions = qmoiRevenueEngine.getTransactionHistory(50);

    return NextResponse.json(transactions);
  } catch (error) {
    (globalThis.console as any)?.error?.("Get transactions error:", error);
    return NextResponse.json(
      { error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}
