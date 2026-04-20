// [PRODUCTION_IMPLEMENTED] this file has no remaining production markers
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { qmoiTrader } from "@/lib/qmoi-trader";
import libProposals from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/cashon/start-trading
export async function POST(_request: NextRequest) {
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

    const canRun = process.env.production_CONFIRMED === "true";
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

    await qmoiTrader.startTrading();
    return NextResponse.json({
      success: true,
      message: "AI trading started successfully",
    });
  } catch (_error) {
    (console as any).error("Start trading API _error:", _error);
    return NextResponse.json(
      { _error: "Failed to start trading" },
      { status: 500 },
    );
  }
}
