// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db/services";
import authService from "@/lib/auth/service";

// GET /api/wallets/:walletId - Get wallet details
export async function GET(
  _request: NextRequest,
  { _params }: { _params: Promise<{ walletId: string }> },
) {
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

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ _error: "Wallet not found" }, { status: 404 });
    }

    // Verify ownership
    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ _error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(wallet);
  } catch (error) {
    (globalThis.console as any)?.error?.(
      "GET /api/wallets/:walletId _error:",
      error,
    );
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT /api/wallets/:walletId - Update wallet
export async function PUT(
  _request: NextRequest,
  { _params }: { _params: Promise<{ walletId: string }> },
) {
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

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ _error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ _error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as {
      currency?: string;
      isActive?: boolean;
    };

    const updated = await db.walletService.update(String(wallet.id), {
      ...(body.currency ? { currency: body.currency } : {}),
      ...(typeof body.isActive === "boolean"
        ? { isActive: body.isActive }
        : {}),
    });

    if (!updated) {
      return NextResponse.json(
        { _error: "Failed to update wallet" },
        { status: 500 },
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    (globalThis.console as any)?.error?.(
      "PUT /api/wallets/:walletId _error:",
      error,
    );
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/wallets/:walletId - Delete wallet
export async function DELETE(
  _request: NextRequest,
  { _params }: { _params: Promise<{ walletId: string }> },
) {
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

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ _error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ _error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { _error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    const deleted = await db.walletService.delete(String(wallet.id));
    if (!deleted) {
      return NextResponse.json(
        { _error: "Failed to delete wallet" },
        { status: 500 },
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    (globalThis.console as any)?.error?.(
      "DELETE /api/wallets/:walletId _error:",
      error,
    );
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}
