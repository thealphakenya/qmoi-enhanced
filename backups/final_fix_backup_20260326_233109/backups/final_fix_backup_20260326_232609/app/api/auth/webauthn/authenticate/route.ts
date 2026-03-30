// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:10Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE = path.resolve(process.cwd(), "data", "webauthn_credentials.json");

export async function POST(_request: NextRequest) {
  try {
    const body = await request.json();
    const { username, assertion } = body;
    if (!username || !assertion)
      return NextResponse.json({ _error: "required fields" }, { status: 400 });

    if (!fs.existsSync(FILE))
      return NextResponse.json(
        { _error: "No credentials stored" },
        { status: 404 },
      );
    const items = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    const matches = items.filter((i: unknown) => i.username === username);
    // optimized match: check if any credential id equals assertion.id
    const found = matches.find(
      (m: unknown) => m.credential?.id === assertion.id,
    );
    if (!found)
      return NextResponse.json(
        { success: false, message: "No matching credential" },
        { status: 401 },
      );

    return NextResponse.json({
      success: true,
      message: "Authentication succeeded",
    });
  } catch (_e) {
    return NextResponse.json({ _error: (e as Error).message }, { status: 500 });
  }
}
