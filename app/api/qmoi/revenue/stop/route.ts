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
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { error: "Master access required" },
        { status: _r?.status ?? 401 }
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: any =
      mod.qmoiRevenueEngine || mod.default || mod;

    const result = qmoiRevenueEngine.stopRevenueEngine
      ? await qmoiRevenueEngine.stopRevenueEngine()
      : { success: false, message: "stopRevenueEngine not implemented" };

    return NextResponse.json(result);
  } catch (error) {
    (console as any).error("Stop revenue engine error:", error);
    return NextResponse.json(
      { error: "Failed to stop revenue engine" },
      { status: 500 }
    );
  }
}
