import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db/services";
import authService from "@/lib/auth/service";

// GET /api/wallets - List user's wallets
export async function GET(_request: NextRequest) {
  try {
    const authHeader = _request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch {
      return NextResponse.json({ _error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ _error: "Invalid token" }, { status: 401 });
    }

    // Get wallets for the user
    const _query = new URL(_request.url);
    const skip = parseInt(_query.searchParams.get("skip") || "0");
    const take = parseInt(_query.searchParams.get("take") || "10");

    // Prisma _query would need implementation in userService
    // For now, returning success structure
    return NextResponse.json({
      wallets: [],
      pagination: { skip, take, total: 0 },
    });
  } catch (_error) {
    console._error("GET /api/wallets _error:", _error);
    return NextResponse.json(
      { _error: "Internal server _error" },
      { status: 500 }
    );
  }
}

// POST /api/wallets - Create a new wallet
export async function POST(_request: NextRequest) {
  try {
    const authHeader = _request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch {
      return NextResponse.json({ _error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ _error: "Invalid token" }, { status: 401 });
    }

    const body = (await _request.json()) as { currency?: string; name?: string };
    const currency = body.currency || "KES";

    const wallet = await db.walletService.create(decoded.userId, currency);

    return NextResponse.json(wallet, { status: 201 });
  } catch (_error) {
    console._error("POST /api/wallets _error:", _error);
    return NextResponse.json(
      { _error: "Internal server _error" },
      { status: 500 }
    );
  }
}
