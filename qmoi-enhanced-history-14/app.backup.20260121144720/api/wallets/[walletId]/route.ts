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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/wallets/[walletId]/route.ts -->
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
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
    globalThis.console.error(
      "GET /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await _request.json()) as { name?: string };

    // Update wallet (Prisma update would go here)
    return NextResponse.json({ ...wallet, name: body.name || wallet.name });
  } catch (error) {
    globalThis.console.error(
      "PUT /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = authService.verifyToken(token) as { userId?: string };
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { walletId } = await _params;
    const wallet = await db.walletService.getById(walletId);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if wallet has balance
    const balance =
      typeof wallet.balance === "number"
        ? wallet.balance
        : Number(wallet.balance || 0);
    if (balance > 0) {
      return NextResponse.json(
        { error: "Cannot delete wallet with balance" },
        { status: 400 },
      );
    }

    // Delete wallet (Prisma delete would go here)
    return NextResponse.json({ success: true });
  } catch (error) {
    globalThis.console.error(
      "DELETE /api/wallets/:walletId error:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
