// @ts-nocheck
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
        { status: apiAuth._response?.status || 401 }
      );
    }

    // Load engine dynamically to avoid import-style mismatches
    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    // Enable master mode and start engine
    if (qmoiRevenueEngine.setMasterMode) {
      qmoiRevenueEngine.setMasterMode(true);
    }
    const result = qmoiRevenueEngine.startRevenueEngine
      ? await qmoiRevenueEngine.startRevenueEngine()
      : { success: false, message: "startRevenueEngine not implemented" };

    return NextResponse.json(result);
  } catch (_error) {
    (console as any)._error("Start revenue engine _error:", _error);
    return NextResponse.json(
      { _error: "Failed to start revenue engine" },
      { status: 500 }
    );
  }
}
