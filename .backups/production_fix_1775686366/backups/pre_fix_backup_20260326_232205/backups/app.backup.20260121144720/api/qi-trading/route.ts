// 
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey, writeProposal } from "../../../lib/proposals";
import { TradingService } from "../../../lib/services/trading";
import { connectToTradingEngine } from "../../../lib/services/trading-engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface Trade {
  id?: string;
  symbol: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  timestamp?: string;
  status?: "completed" | "pending" | "failed";
  profit?: number;
}

interface TradingStats {
  totalTrades: number;
  successfulTrades: number;
  failedTrades: number;
  totalProfit: number;
  winRate: number;
  averageProfit: number;
  bestTrade: Trade;
  worstTrade: Trade;
}

async function fetchTradingStats(): Promise<TradingStats> {
  const tradingService = TradingService.getInstance();
  return await tradingService.getTradingStats();
}

async function fetchTradeHistory(): Promise<Trade[]> {
  const tradingService = TradingService.getInstance();
  return await tradingService.getTradeHistory();
}

async function fetchActiveTrades(): Promise<Trade[]> {
  const tradingService = TradingService.getInstance();
  return await tradingService.getActiveTrades();
}

async function executeTrade(trade: Trade): Promise<Trade> {
  const tradingService = TradingService.getInstance();

  // Create initial trade record
  const newTrade = await tradingService.createTrade({
    ...trade,
    timestamp: new Date().toISOString(),
    status: "pending",
  });

  try {
    // Connect to your real trading engine here
    // This is where you'd integrate with your actual trading platform API
    const engine = await connectToTradingEngine();

    // Execute trade with engine
    const engineResult = await tradingService.executeTrade(trade);

    // Update trade with results
    const updated = await tradingService.updateTrade(newTrade.id || "", {
      status: "completed",
      profit: engineResult.profit || 0,
    });
    return updated || newTrade;
  } catch (e) {
}

async function cancelTrade(
  tradeId: string,
): Promise<{ success: boolean; message: string }> {
  const tradingService = TradingService.getInstance();

  try {
    // First check if trade exists and is pending
    const cancelled = await tradingService.cancelTrade(tradeId);

    if (!cancelled) {
      return {
        success: false,
        message: "Trade not found or already completed/cancelled",
      };
    }

    // Here you would also cancel the trade on your trading platform if needed
    // For now we just handle the database state

    return {
      success: true,
      message: "Trade cancelled successfully",
    };
  } catch (_error) {
    (console as any).error("Error cancelling trade:", _error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unknown error cancelling trade",
    };
  }
}

export async function GET(_request: NextRequest) {
  // Gate reads with API key as well
  const auth = await requireApiKey(_request.headers);
  if (!auth.ok) return auth.response;

  try {
    const searchParams = _request.nextUrl.searchParams;
    const stats = searchParams.get("stats");
    const history = searchParams.get("history");
    const active = searchParams.get("active");

    if (stats) {
      const statsData: TradingStats = await fetchTradingStats();
      return NextResponse.json(statsData);
    }

    if (history) {
      const tradeHistory: Trade[] = await fetchTradeHistory();
      return NextResponse.json({ trades: tradeHistory });
    }

    if (active) {
      const activeTrades: Trade[] = await fetchActiveTrades();
      return NextResponse.json({ activeTrades });
    }

    return NextResponse.json(
      { _error: "Invalid query parameter" },
      { status: 400 },
    );
  } catch (_error) {
    (console as any).error("Error in QI trading endpoint:", _error);
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  // Mutating actions are proposal-first by default
  const auth = await requireApiKey(_request.headers);
  if (!auth.ok) return auth.response;

  try {
    const body = await _request.json();
    const { action, trade } = body;

    const canRun = process.env.production_CONFIRMED === "true";

    if (action === "execute") {
      if (!canRun) {
        await writeProposal({
          id: `trade-execute-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: "qi_trading_execute",
          details: { trade },
        });
        return NextResponse.json({
          status: "proposed",
          message:
            "Execute trade proposed. Set production_CONFIRMED=true to execute.",
        });
      }

      const executedTrade: Trade = await executeTrade(trade);
      return NextResponse.json({
        status: "success",
        message: "Trade executed successfully",
        trade: executedTrade,
      });
    }

    if (action === "cancel") {
      if (!canRun) {
        await writeProposal({
          id: `trade-cancel-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: "qi_trading_cancel",
          details: { tradeId: trade?.id },
        });
        return NextResponse.json({
          status: "proposed",
          message:
            "Cancel trade proposed. Set production_CONFIRMED=true to execute.",
        });
      }

      const cancelResult = await cancelTrade(trade.id);
      return NextResponse.json({
        status: cancelResult.success ? "success" : "error",
        message: cancelResult.message,
        tradeId: trade.id,
      });
    }

    return NextResponse.json(
      { _error: "Invalid action specified" },
      { status: 400 },
    );
  } catch (_error) {
    (console as any).error("Error in QI trading execution endpoint:", _error);
    return NextResponse.json(
      { _error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
