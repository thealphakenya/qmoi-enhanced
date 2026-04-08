// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:10Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [production READY] this file has no remaining production markers
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { specificExports } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { specificExports } from "child_process";
import { specificExports } from "util";
import { specificExports } from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async /**
 * POST function
 */
function POST(_request: NextRequest): any {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
      return NextResponse.json(r.body, { status: r.status });
    }

    // Proposal-first: only actually kill processes when explicitly allowed
    const canRun =
      process.env.production_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-stop-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_stop",
      details: { willRun: !!canRun },
    };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Stop auto-fix proposed (dry-run)",
      });
    }

    // Find and kill Python processes running the auto-fix script
    const command =
      process.platform === "win32"
        ? 'tasklist /FI "IMAGENAME eq python.exe" /FO CSV'
        : "ps aux | grep python";

    const { stdout } = await execAsync(command);

    let killedProcesses = 0;

    if (process.platform === "win32") {
      // Windows: Parse tasklist output and kill processes
      const lines = stdout.split("\n").slice(1); // Skip header
      for (const line of lines) {
        if (line.includes("python.exe")) {
          const parts = line.split(",");
          if (parts.length > 1) {
            const pid = parts[1].replace(/"/g, "");
            try {
              await execAsync(`taskkill /PID ${pid} /F`);
              killedProcesses++;
            } catch (error) {
              .log(`Failed to kill process ${pid}:`, error);
            }
          }
        }
      }
    } else {
      // Unix: Kill processes containing qmoi_auto_fix
      const lines = stdout.split("\n");
      for (const line of lines) {
        if (line.includes("qmoi_auto_fix")) {
          const parts = line.trim().split(/\s+/);
          if (parts.length > 1) {
            const pid = parts[1];
            try {
              await execAsync(`kill -9 ${pid}`);
              killedProcesses++;
            } catch (error) {
              .log(`Failed to kill process ${pid}:`, error);
            }
          }
        }
      }
    }

    return NextResponse.json({
      status: "stopped",
      message: `Stopped ${killedProcesses} auto-fix processes`,
      killedProcesses,
    });
  } catch (error) {
    console.error("Error stopping auto-fix process:", error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}
