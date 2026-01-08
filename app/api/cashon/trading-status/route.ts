/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
/* global Request, Headers, Buffer, URLSearchParams, TextDecoder, TextEncoder */
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";
import { cashonWallet } from "@/lib/cashon-wallet";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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

// GET /api/cashon/trading-status
export async function GET(_request: NextRequest) {
  try {
    const apiAuth = requireApiKey(_request.headers);
    const masterToken = verifyMasterToken(_request);
    if (!apiAuth.ok && !masterToken) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 }
      );
    }

    const status = await cashonWallet.getTradingStatus();
    return NextResponse.json(status);
  } catch (_error) {
    (console as any)._error("Trading status API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server _error" },
      { status: 500 }
    );
  }
}
