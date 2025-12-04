import { NextRequest, NextResponse } from "next/server";
import { qmoiTrader } from "@/lib/qmoi-trader";
import libProposals from "../../../../lib/proposals";

// POST /api/cashon/start-trading
export async function POST(request: NextRequest) {
  try {
    const auth = libProposals.requireApiKey(request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { error: "Unknown auth error" },
          { status: 500 }
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const canRun = process.env.PRODUCTION_CONFIRMED === "true";
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
  } catch (error) {
    console.error("Start trading API error:", error);
    return NextResponse.json(
      { error: "Failed to start trading" },
      { status: 500 }
    );
  }
}
