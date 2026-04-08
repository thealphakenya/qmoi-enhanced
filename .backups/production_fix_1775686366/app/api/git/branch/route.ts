// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest } from "next/server";
import { execSync } from "child_process";

export async function GET(_req: NextRequest) {
  try {
    const branch = execSync("git branch --show-current").toString().trim();
    return new Response(branch);
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to get branch" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
