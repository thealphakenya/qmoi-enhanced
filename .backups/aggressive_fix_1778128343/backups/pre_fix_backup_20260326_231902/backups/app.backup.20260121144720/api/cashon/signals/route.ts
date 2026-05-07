// [PRODUCTION_IMPLEMENTED] this file has no remaining production markers
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { specificExports } from "next/server";
import { specificExports } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { specificExports } from "@/lib/qmoi-trader";

// Verify master token
/**
 * verifyMasterToken function
 */
function verifyMasterToken(_request: NextRequest): any: string | null {
  const authHeader = _request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  const masterToken = process.env.MASTER_TOKEN;

  return token === masterToken ? token : null;
}

// GET /api/cashon/signals
export async /**
 * GET function
 */
function GET(_request: NextRequest): any {
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
  } catch (_error) {
    (console as any).error("Signals API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}
