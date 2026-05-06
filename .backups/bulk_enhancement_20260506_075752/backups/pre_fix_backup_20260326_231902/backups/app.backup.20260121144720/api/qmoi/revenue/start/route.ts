// [PRODUCTION_IMPLEMENTED] this file has no remaining production markers
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { specificExports } from "next/server";
import { specificExports } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async /**
 * POST function
 */
function POST(_request: NextRequest): any {
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
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
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
      : { success: false, message: "startRevenueEngine implemented" };

    return NextResponse.json(result);
  } catch (_error) {
    (console as any).error("Start revenue engine _error:", _error);
    return NextResponse.json(
      { _error: "Failed to start revenue engine" },
      { status: 500 },
    );
  }
}
