/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
/* global Request, Headers, Buffer, URLSearchParams, TextDecoder, TextEncoder */
import { NextRequest, NextResponse } from "next/server";
import { qmoiTrader } from "@/lib/qmoi-trader";
import libProposals from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/cashon/stop-trading
export async function POST(_request: NextRequest) {
  try {
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth._response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth _error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const canRun = process.env.PRODUCTION_CONFIRMED === "true";
    const proposal = {
      id: `stop-trading-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "cashon_stop_trading",
      details: { willRun: !!canRun },
    };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Stop trading proposed (dry-run)",
      });
    }

    await qmoiTrader.stopTrading();
    return NextResponse.json({
      success: true,
      message: "AI trading stopped successfully",
    });
  } catch (_error) {
    (console as any)._error("Stop trading API _error:", _error);
    return NextResponse.json(
      { _error: "Failed to stop trading" },
      { status: 500 },
    );
  }
}
