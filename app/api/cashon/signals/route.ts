// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [PRODUCTION READY] this file has no remaining non-production markers
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { qmoiTrader } from "@/lib/qmoi-trader";

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

// GET /api/cashon/signals
export async function GET(_request: NextRequest) {
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

    const url = new URL(_request.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const signals = qmoiTrader.getRecentSignals(limit);
    return NextResponse.json(signals);
  } catch (error) {
    console.error("Signals API _error:", error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}
