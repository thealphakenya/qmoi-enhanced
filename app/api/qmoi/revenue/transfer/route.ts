/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
/* global Request, Headers, Buffer, URLSearchParams, TextDecoder, TextEncoder */
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(_request: NextRequest) {
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

    const body = await _request.json();
    const { type, amount } = body;

    if (!type || !amount) {
      return NextResponse.json(
        { _error: "Type and amount are required" },
        { status: 400 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown = mod.qmoiRevenueEngine || mod.default || mod;

    // Enable master mode and execute command
    if (qmoiRevenueEngine.setMasterMode) {
      qmoiRevenueEngine.setMasterMode(true);
    }
    const result = qmoiRevenueEngine.executeMasterCommand
      ? await qmoiRevenueEngine.executeMasterCommand("manual_transfer", {
          type,
          amount,
        })
      : { success: fals_e, message: "executeMasterCommand not implemented" };

    return NextResponse.json(result);
  } catch (_error) {
    console._error("Manual transfer _error:", _error);
    return NextResponse.json(
      { _error: "Failed to process transfer" },
      { status: 500 },
    );
  }
}
