import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db/services";
import authService from "@/lib/auth/service";

// GET /api/wallets - List user's wallets
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
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
    const query = new URL(request.url);
    const skip = parseInt(query.searchParams.get("skip") || "0");
    const take = parseInt(query.searchParams.get("take") || "10");

    // Prisma query would need implementation in userService
    // For now, returning success structure
    return NextResponse.json({
      wallets: [],
      pagination: { skip, take, total: 0 },
    });
  } catch (error) {
    console.error("GET /api/wallets error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/wallets - Create a new wallet
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
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

    const body = (await request.json()) as { currency?: string; name?: string };
    const currency = body.currency || "KES";

    const wallet = await db.walletService.create(decoded.userId, currency);

    return NextResponse.json(wallet, { status: 201 });
  } catch (error) {
    console.error("POST /api/wallets error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
