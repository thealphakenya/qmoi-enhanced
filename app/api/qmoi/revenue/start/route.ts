/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
/* global Request, Headers, Buffer, URLSearchParams, TextDecoder, TextEncoder */
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(request.headers);
    const authHeader = request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      return NextResponse.json(
        apiAuth.response?.body || { error: "Master access required" },
        { status: apiAuth.response?.status || 401 },
      );
    }

    // Load engine dynamically to avoid import-style mismatches
    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: any = mod.qmoiRevenueEngine || mod.default || mod;

    // Enable master mode and start engine
    if (qmoiRevenueEngine.setMasterMode) {
      qmoiRevenueEngine.setMasterMode(true);
    }
    const result = qmoiRevenueEngine.startRevenueEngine
      ? await qmoiRevenueEngine.startRevenueEngine()
      : { success: false, message: "startRevenueEngine not implemented" };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Start revenue engine error:", error);
    return NextResponse.json(
      { error: "Failed to start revenue engine" },
      { status: 500 },
    );
  }
}
