/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
/* global Request, Headers, Buffer, URLSearchParams, TextDecoder, TextEncoder */
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(request: NextRequest) {
  try {
    const apiAuth = requireApiKey(request.headers);
    const masterToken = verifyMasterToken(request);
    if (!apiAuth.ok && !masterToken) {
      return NextResponse.json(
        apiAuth.response?.body || { error: "Master access required" },
        { status: apiAuth.response?.status || 401 }
      );
    }

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // TODO: Fetch logs from DB or file
      const logs: any[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (error) {
    console.error("Balance API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/cashon/balance
export async function POST(req: Request) {
  const { action } = await req.json();
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ error: "M-Pesa number not configured" }),
        { status: 500 }
      );
    }
    // Simulate transfer logic here
    try {
      // TODO: Integrate with real M-Pesa API
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { error: errorMessage });
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}
