/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
/* global Request, Headers, Buffer, URLSearchParams, TextDecoder, TextEncoder */
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";
import { cashonWallet } from "@/lib/cashon-wallet";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Verify master token
function verifyMasterToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  const masterToken = process.env.MASTER_TOKEN;

  return token === masterToken ? token : null;
}

// GET /api/cashon/trading-status
export async function GET(request: NextRequest) {
  try {
    const apiAuth = requireApiKey(request.headers);
    const masterToken = verifyMasterToken(request);
    if (!apiAuth.ok && !masterToken) {
      return NextResponse.json(
        apiAuth.response?.body || { error: "Master access required" },
        { status: apiAuth.response?.status || 401 },
      );
    }

    const status = await cashonWallet.getTradingStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error("Trading status API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
