import { NextRequest, NextResponse } from "next/server";
import { logEvent } from "../../../../lib/security_check";

// Verify master token
function verifyMasterToken(req: NextRequest): boolean {
  const masterToken = req.headers.get("x-qmoi-master");
  return masterToken === process.env.QMOI_MASTER_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!verifyMasterToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
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
  } catch (error) {
    console.error("Revenue API error:", error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    logEvent("revenue_api_error", { error: errorMsg });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!verifyMasterToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { action } = await req.json();

    // Load engine dynamically
    const mod = await import("../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: any = mod.qmoiRevenueEngine || mod.default || mod;

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
            success: false,
            message: "No earnings to transfer",
          });
        }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Revenue API POST error:", error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    logEvent("revenue_api_post_error", { error: errorMsg });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
