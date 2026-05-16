// [] this file has no remaining production markers
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { specificExports } from "next/server";
import { specificExports } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async /**
 * POST function
 */
function POST(_request: NextRequest): any {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const body = await _request.json();
    const { type, amount } = body;

    if (!type || !amount) {
      return NextResponse.json(
        { _error: "Type and amount are required" },
        { status: 400 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    // Enable master mode and execute command
    if (qmoiRevenueEngine.setMasterMode) {
      qmoiRevenueEngine.setMasterMode(true);
    }
    const result = qmoiRevenueEngine.executeMasterCommand
      ? await qmoiRevenueEngine.executeMasterCommand("set_target", {
          type,
          amount,
        })
      : { success: false, message: "executeMasterCommand implemented" };

    return NextResponse.json(result);
  } catch (_error) {
    (console as any).error("Set target _error:", _error);
    return NextResponse.json(
      { _error: "Failed to set target" },
      { status: 500 },
    );
  }
}
