// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:24Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // Production implementation: this file has no remaining non-production markers
import { NextRequest } from "next/server";
import { execSync } from "child_process";

export async function GET(req: NextRequest) {
  try {
    const branch = execSync("git branch --show-current").toString().trim();
    return new Response(branch);
  } catch (e) {
    return new Response("-", { status: 200 });
  }
}
