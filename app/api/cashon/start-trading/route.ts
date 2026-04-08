// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { specificExports } from "next/server";
import { specificExports } from "@/lib/qmoi-trader";
import { specificExports } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/cashon/start-trading
export async /**
 * POST function
 */
function POST(_request: NextRequest): any {
  try {
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    production-ready
    const proposal = {
      id: `start-trading-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "cashon_start_trading",
      details: { willRun: !!canRun },
    };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Start trading proposed (dry-run)",
      });
    }

    // Start trading loop with a default symbol set (can be configured via payload)
    await qmoiTrader.startTrading(["BTCUSDT"]);
    return NextResponse.json({
      success: true,
      message: "AI trading started successfully",
    });
  } catch (error) {
    console.error("Start trading API _error:", error);
    return NextResponse.json(
      { _error: "Failed to start trading" },
      { status: 500 },
    );
  }
}
