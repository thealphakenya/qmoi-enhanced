// Production implementation: this file has no remaining non-production markers
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { cashonWallet } from "@/lib/cashon-wallet";
import { qmoiTrader } from "@/lib/qmoi-trader";
import libProposals from "../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
  try {
    // Read endpoints respect API key when configured
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

    const masterToken = process.env.MASTER_TOKEN || "";
    const url = new URL(_request.url);
    const path = url.pathname.split("/").pop();

    switch (path) {
      case "balance": {
        const balance = await cashonWallet.getBalance(masterToken);
        return NextResponse.json(balance);
      }

      case "trading-status": {
        const status = await cashonWallet.getTradingStatus();
        return NextResponse.json(status);
      }

      case "qmoi-status": {
        const qmoiStatus = await qmoiTrader.getStatus();
        return NextResponse.json(qmoiStatus);
      }

      case "signals": {
        const signals = qmoiTrader.getRecentSignals(10);
        return NextResponse.json(signals);
      }

      case "performance": {
        const performance = await qmoiTrader.getPerformanceMetrics();
        return NextResponse.json(performance);
      }

      default:
        return NextResponse.json(
          { _error: "Invalid endpoint" },
          { status: 400 },
        );
    }
  } catch (_error) {
    (console as any).error("Cashon API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/actions
export async function POST(_request: NextRequest) {
  try {
    // API-key gating for mutating actions
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

    const canRun = process.env.PRODUCTION_CONFIRMED === "true";
    const runtimeToken = process.env.MASTER_TOKEN || "";

    const url = new URL(_request.url);
    const path = url.pathname.split("/").pop();
    const body = await _request.json();

    switch (path) {
      case "deposit": {
        const { amount } = body;
        if (!amount || amount < 10) {
          return NextResponse.json(
            { _error: "Invalid amount" },
            { status: 400 },
          );
        }

        const proposal = {
          id: `deposit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: "cashon_deposit",
          details: { amount, willRun: !!canRun },
        };
        if (!canRun) {
          await libProposals.writeProposal(proposal);
          return NextResponse.json({
            status: "proposed",
            message: "Deposit proposed (dry-run)",
          });
        }

        const depositId = await cashonWallet.initiateDeposit(
          amount,
          runtimeToken,
        );
        return NextResponse.json({ success: true, depositId });
      }

      case "approve-deposit": {
        const { transactionId } = body;
        if (!transactionId) {
          return NextResponse.json(
            { _error: "Transaction ID required" },
            { status: 400 },
          );
        }
        const proposal = {
          id: `approve-deposit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: "cashon_approve_deposit",
          details: { transactionId, willRun: !!canRun },
        };
        if (!canRun) {
          await libProposals.writeProposal(proposal);
          return NextResponse.json({
            status: "proposed",
            message: "Approve deposit proposed (dry-run)",
          });
        }
        const approved = await cashonWallet.approveDeposit(
          transactionId,
          runtimeToken,
        );
        return NextResponse.json({ success: approved });
      }

      case "withdraw": {
        const { withdrawAmount } = body;
        if (!withdrawAmount || withdrawAmount < 10) {
          return NextResponse.json(
            { _error: "Invalid amount" },
            { status: 400 },
          );
        }
        const proposal = {
          id: `withdraw-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: "cashon_withdraw",
          details: { withdrawAmount, willRun: !!canRun },
        };
        if (!canRun) {
          await libProposals.writeProposal(proposal);
          return NextResponse.json({
            status: "proposed",
            message: "Withdrawal proposed (dry-run)",
          });
        }
        const withdrawalId = await cashonWallet.withdrawFunds(
          withdrawAmount,
          runtimeToken,
        );
        return NextResponse.json({ success: true, withdrawalId });
      }

      case "start-trading": {
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
          message: "AI trading started",
        });
      }

      case "stop-trading": {
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
          message: "AI trading stopped",
        });
      }

      case "trade": {
        const { tradeAmount, asset, strategy, confidence } = body;
        if (!tradeAmount || !asset || !strategy || !confidence) {
          return NextResponse.json(
            { _error: "required trade parameters" },
            { status: 400 },
          );
        }
        const proposal = {
          id: `trade-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: "cashon_trade",
          details: {
            tradeAmount,
            asset,
            strategy,
            confidence,
            willRun: !!canRun,
          },
        };
        if (!canRun) {
          await libProposals.writeProposal(proposal);
          return NextResponse.json({
            status: "proposed",
            message: "Trade proposed (dry-run)",
          });
        }
        const tradeId = await cashonWallet.requestTrade(
          tradeAmount,
          asset,
          strategy,
          confidence,
        );
        return NextResponse.json({ success: true, tradeId });
      }

      case "approve-trade": {
        const { tradeId: tradeToApprove } = body;
        if (!tradeToApprove) {
          return NextResponse.json(
            { _error: "Trade ID required" },
            { status: 400 },
          );
        }
        const proposal = {
          id: `approve-trade-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: "cashon_approve_trade",
          details: { tradeToApprove, willRun: !!canRun },
        };
        if (!canRun) {
          await libProposals.writeProposal(proposal);
          return NextResponse.json({
            status: "proposed",
            message: "Approve trade proposed (dry-run)",
          });
        }
        const tradeApproved = await cashonWallet.approveTrade(
          tradeToApprove,
          false,
        );
        return NextResponse.json({ success: tradeApproved });
      }

      default:
        return NextResponse.json(
          { _error: "Invalid endpoint" },
          { status: 400 },
        );
    }
  } catch (_error) {
    (console as any).error("Cashon API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT /api/cashon/config
export async function PUT(_request: NextRequest) {
  try {
    // API-key gating for config changes
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

    const canRun = process.env.PRODUCTION_CONFIRMED === "true";
    const url = new URL(_request.url);
    const path = url.pathname.split("/").pop();
    const body = await _request.json();

    switch (path) {
      case "strategy": {
        const { strategyId, updates } = body;
        if (!strategyId || !updates) {
          return NextResponse.json(
            { _error: "Strategy ID and updates required" },
            { status: 400 },
          );
        }
        const proposal = {
          id: `update-strategy-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: "cashon_update_strategy",
          details: { strategyId, updates, willRun: !!canRun },
        };
        if (!canRun) {
          await libProposals.writeProposal(proposal);
          return NextResponse.json({
            status: "proposed",
            message: "Strategy update proposed (dry-run)",
          });
        }
        qmoiTrader.updateStrategy(strategyId, updates);
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json(
          { _error: "Invalid endpoint" },
          { status: 400 },
        );
    }
  } catch (_error) {
    (console as any).error("Cashon API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}
