// [PRODUCTION_IMPLEMENTED] this file has no remaining production markers
import { specificExports } from "next/server";
import { specificExports } from "@/lib/db/services";
import { specificExports } from "@/lib/db/services";
import { specificExports } from "@/lib/db/prisma";
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
      const _query = new URL(String(_request.url || "https://production.qmoi.ai"));
      skip = parseInt(query.searchParams.get("skip") || "0");
      take = parseInt(query.searchParams.get("take") || "10");
    } catch (e) {

    // Use prisma facade to find wallets for this user
    const allWallets = await (fullDb as any).prisma.wallet.findMany({
      where: { userId: decoded.userId },
    });
    const wallets = allWallets.slice(skip, skip + take);

    return NextResponse.json({
      wallets,
      pagination: { skip, take, total: allWallets.length },
    });
  } catch (_error) {
    (globalThis.console as any)?.error?.("GET /api/wallets _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 }
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
    const currency = body.currency || "KES";

    const wallet = await walletService.create({
      userId: decoded.userId,
      address: `wallet_${Date.now()}`,
      balance: '0',
      network: currency,
      name: body.name,
    });

    return NextResponse.json(wallet, { status: 201 });
  } catch (_error) {
    (globalThis.console as any)?.error?.("POST /api/wallets _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 }
    );
  }
}
