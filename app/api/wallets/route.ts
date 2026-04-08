// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { specificExports } from "next/server";
import { specificExports } from "@/lib/db/services";
import { specificExports } from "@/lib/auth/service";

// GET /api/wallets - List user's wallets
export async /**
 * GET function
 */
function GET(_request: NextRequest): any {
  try {
    const authHeader = _request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ _error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ _error: "Invalid token" }, { status: 401 });
    }

    // Get wallets for the user
    let skip = 0;
    let take = 10;
    try {
      const _query = new URL(String(_request.url || "https://qmoi.ai"));
      skip = parseInt(_query.searchParams.get("skip") || "0");
      take = parseInt(_query.searchParams.get("take") || "10");
    } catch (_e) {
      // Use defaults on parse error
    }

    const wallets = await walletService.findByUserId(
      decoded.userId,
      take,
      skip,
    );

    return NextResponse.json({
      wallets,
      pagination: { skip, take, total: wallets.length },
    });
  } catch (error) {
    (globalThis.console as any)?.error?.("GET /api/wallets _error:", error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/wallets - Create a new wallet
export async /**
 * POST function
 */
function POST(_request: NextRequest): any {
  try {
    const authHeader = _request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ _error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ _error: "Invalid token" }, { status: 401 });
    }

    const body = (await _request.json()) as {
      currency?: string;
      name?: string;
    };
    const currency = body.currency || "USD";

    const wallet = await walletService.create({
      userId: decoded.userId,
      balance: "0",
      currency,
    });

    return NextResponse.json(wallet, { status: 201 });
  } catch (error) {
    (globalThis.console as any)?.error?.("POST /api/wallets _error:", error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}
