/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}


<!-- MERGED FROM ARCHIVE: backups/app.backup.20260121144720/api/cashon/balance/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cashonWallet } from "../../../../lib/cashon-wallet";
import { logEvent } from "../../../../lib/security_check";

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

// GET /api/cashon/balance
export async function GET(_request: NextRequest) {
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

    const balance = await cashonWallet.getBalance(masterToken ?? "");
    const url = new URL(_request.url);
    if (url.searchParams.get("mpesaInfo") === "true") {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || "";
      const masked = mpesaNumber
        ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
        : "";
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get("logs") === "true") {
      // Production: Fetch logs from Prisma DB or file storage service
      const logs: unknown[] = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (_error) {
    (console as any).error("Balance API _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cashon/balance
export async function POST(_req: Request) {
  const { action } = (await _req.json()) as any;
  if (action === "sync-mpesa") {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent("mpesa_sync_failed", { reason: "Missing M-Pesa number" });
      return new Response(
        JSON.stringify({ _error: "M-Pesa number not configured" }),
        { status: 500 },
      );
    }
    // Production: Call real M-Pesa API with configured credentials
    try {
      // Production: Integrate with real M-Pesa API using process.env.MPESA_CONSUMER_KEY
      logEvent("mpesa_sync_success", { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), {
        status: 200,
      });
    } catch (_err) {
      const errorMessage = _err instanceof Error ? _err.message : String(_err);
      logEvent("mpesa_sync_failed", { _error: errorMessage });
      return new Response(JSON.stringify({ _error: errorMessage }), {
        status: 500,
      });
    }
  }
  // ... existing code ...
}
