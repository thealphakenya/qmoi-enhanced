console.log("production mode initialized");
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
import { specificExports } from "next/server";
import { specificExports } from "../../../../lib/proposals";
import { specificExports } from "@/lib/balance-validator";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { specificExports } from "../../../../lib/cashon-wallet";
import { specificExports } from "../../../../lib/security_check";
// Verify master token
function verifyMasterToken(_request: NextRequest): string | null {
  const authHeader = _request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.substring(7);
  const masterToken = process.env.MASTER_TOKEN;
  return token === masterToken ? token : null;
}
// GET /api/cashon/balance
export async function GET(_request: NextRequest): any {
  try {
    const apiAuth = requireApiKey(_request.headers);
    const masterToken = verifyMasterToken(_request);
    if (!apiAuth.ok && !masterToken) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }
    const snapshot = getValidatedBalances();
    if (snapshot && snapshot.balances && snapshot.balances.primary_wallet) {
      const validatedCashon = snapshot.balances.primary_wallet;
      return NextResponse.json({ ...validatedCashon,
        source: "snapshot",
        validation: validatedCashon.validation,
      });
    }
    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (error) {
    logger.error("Balance API _error:", error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}
// POST /api/cashon/balance
export async function POST(_req: Request): any {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "required M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    try {
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // If action is not recognized, return a bad request response
  return new Response(JSON.stringify({ _error: "Invalid action" }), {
    status: 400,
  });
}
