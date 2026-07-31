/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/stop/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { exec } from "child_process";
import { promisify } from "util";
import libProposals from "../../../../../lib/proposals";

const execAsync = promisify(exec);

export async function POST(_request: NextRequest) {
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
      process.env.PRODUCTION_CONFIRMED === "true" &&
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
            } catch (_error) {
              console.log(`Failed to kill process ${pid}:`, _error);
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
  } catch (_error) {
    (console as any).error("Error stopping auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to stop auto-fix process" },
      { status: 500 },
    );
  }
}
