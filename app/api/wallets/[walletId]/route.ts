import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db/services";
import authService from "@/lib/auth/service";

// GET /api/wallets/:walletId - Get wallet details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ walletId: string }> }
) {
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

    const { walletId } = await params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    // Verify ownership
    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(wallet);
  } catch (error) {
    console.error("GET /api/wallets/:walletId error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/wallets/:walletId - Update wallet
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ walletId: string }> }
) {
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

    const { walletId } = await params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    console.error("PUT /api/wallets/:walletId error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/wallets/:walletId - Delete wallet
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ walletId: string }> }
) {
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

    const { walletId } = await params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    if (wallet.balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 }
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/wallets/:walletId error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
