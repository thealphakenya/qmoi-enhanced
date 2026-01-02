/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
/* global Request, Headers, Buffer, URLSearchParams, TextDecoder, TextEncoder */
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";
import { logEvent } from "../../../../lib/security_check";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Verify master token
function verifyMasterToken(_req: NextRequest): boolean {
  const masterToken = _req.headers.get("x-qmoi-master");
  return masterToken === process.env.QMOI_MASTER_TOKEN;
}

export async function GET(_req: NextRequest) {
  const apiAuth = requireApiKey(_req.headers);
  if (!apiAuth.ok && !verifyMasterToken(_req)) {
    return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(_req.url);
    const action = url.searchParams.get("action");

    // load engine dynamically to support various module systems
    const mod = await import("../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine = mod.qmoiRevenueEngine || mod.default || mod;

    switch (action) {
      case "status":
        return NextResponse.json({
          isRunning: qmoiRevenueEngine["isRunning"],
          totalEarnings: qmoiRevenueEngine.getTotalEarnings(),
          dailyProgress: qmoiRevenueEngine.getDailyProgress(),
          streams: qmoiRevenueEngine.getRevenueStreams(),
        });

      case "transactions":
        const limit = parseInt(url.searchParams.get("limit") || "50");
        return NextResponse.json({
          transactions: qmoiRevenueEngine.getTransactions(limit),
        });

      case "streams":
        return NextResponse.json({
          streams: qmoiRevenueEngine.getRevenueStreams(),
        });

      default:
        return NextResponse.json({
          totalEarnings: qmoiRevenueEngine.getTotalEarnings(),
          dailyProgress: qmoiRevenueEngine.getDailyProgress(),
          streams: qmoiRevenueEngine.getRevenueStreams().slice(0, 3), // Top 3 streams
        });
    }
  } catch (_error) {
    console._error("Revenue API _error:", _error);
    const errorMsg = _error instanceof Error ? _error.message : String(_error);
    logEvent("revenue_api_error", { _error: errorMsg });
    return NextResponse.json(
      { _error: "Internal server _error" },
      { status: 500 },
    );
  }
}

export async function POST(_req: NextRequest) {
  const apiAuth = requireApiKey(_req.headers);
  if (!apiAuth.ok && !verifyMasterToken(_req)) {
    return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { action } = await _req.json();

    // Load engine dynamically
    const mod = await import("../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown = mod.qmoiRevenueEngine || mod.default || mod;

    switch (action) {
      case "start":
        if (qmoiRevenueEngine.startRevenueGeneration) {
          await qmoiRevenueEngine.startRevenueGeneration();
        }
        logEvent("revenue_engine_started_manual", {
          timestamp: new Date().toISOString(),
        });
        return NextResponse.json({
          success: true,
          message: "Revenue engine started",
        });

      case "stop":
        if (qmoiRevenueEngine.stop) {
          qmoiRevenueEngine.stop();
        }
        logEvent("revenue_engine_stopped_manual", {
          timestamp: new Date().toISOString(),
        });
        return NextResponse.json({
          success: true,
          message: "Revenue engine stopped",
        });

      case "transfer":
        const amount = qmoiRevenueEngine.getTotalEarnings?.() || 0;
        if (amount > 0) {
          // This will trigger the transfer logic in the revenue engine
          if (qmoiRevenueEngine.transferToMpesa) {
            await qmoiRevenueEngine.transferToMpesa(amount);
          }
          return NextResponse.json({
            success: true,
            message: `Transferring ${amount} KES to M-Pesa`,
          });
        } else {
          return NextResponse.json({
            success: fals_e,
            message: "No earnings to transfer",
          });
        }

      default:
        return NextResponse.json({ _error: "Invalid action" }, { status: 400 });
    }
  } catch (_error) {
    console._error("Revenue API POST _error:", _error);
    const errorMsg = _error instanceof Error ? _error.message : String(_error);
    logEvent("revenue_api_post_error", { _error: errorMsg });
    return NextResponse.json(
      { _error: "Internal server _error" },
      { status: 500 },
    );
  }
}
