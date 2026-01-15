import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db/services";
import { walletService } from "@/lib/db/services";
import { db as fullDb } from "@/lib/db/prisma";
import authService from "@/lib/auth/service";

// GET /api/wallets - List user's wallets
export async function GET(_request: NextRequest) {
  try {
    const authHeader = _request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get wallets for the user
    let skip = 0;
    let take = 10;
    try {
      const query = new URL(String(_request.url || "http://localhost"));
      skip = parseInt(query.searchParams.get("skip") || "0");
      take = parseInt(query.searchParams.get("take") || "10");
    } catch (_e) {
      // ignore parse errors and keep defaults
    }

    // Use prisma facade to find wallets for this user
    const allWallets = await (fullDb as any).prisma.wallet.findMany({
      where: { userId: decoded.userId },
    });
    const wallets = allWallets.slice(skip, skip + take);

    return NextResponse.json({
      wallets,
      pagination: { skip, take, total: allWallets.length },
    });
  } catch (error) {
    (globalThis.console as any)?.error?.("GET /api/wallets error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/wallets - Create a new wallet
export async function POST(_request: NextRequest) {
  try {
    const authHeader = _request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = (await _request.json()) as {
      currency?: string;
      name?: string;
    };
    const currency = body.currency || "KES";

    const wallet = await walletService.create({
      userId: decoded.userId,
      address: `wallet_${Date.now()}`,
      balance: '0',
      network: currency,
      name: body.name,
    });

    return NextResponse.json(wallet, { status: 201 });
  } catch (error) {
    (globalThis.console as any)?.error?.("POST /api/wallets error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
