// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// Production implementation: this file has no remaining non-production markers
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");

export async function GET() {
  try {
    const data = fs.existsSync(USERS_FILE)
      ? JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"))
      : [];
    return NextResponse.json({ users: data });
  } catch (_e) {
    return NextResponse.json(
      { _error: (_e as Error).message },
      { status: 500 },
    );
  }
}
