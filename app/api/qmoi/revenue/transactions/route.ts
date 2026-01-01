/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
/* global Request, Headers, Buffer, URLSearchParams, TextDecoder, TextEncoder */
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      return NextResponse.json(
        apiAuth._response?.body || { _error: "Master access required" },
        { status: apiAuth._response?.status || 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown = mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    console.error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}
