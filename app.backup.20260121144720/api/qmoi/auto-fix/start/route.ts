/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/auto-fix/start/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import libProposals from "../../../../../lib/proposals";

export async function POST(_request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (!r)
        return NextResponse.json(
          { _error: "Unknown auth error" },
          { status: 500 },
        );
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "qmoi_auto_fix_enhanced.py",
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { _error: "Auto-fix script not found" },
        { status: 404 },
      );
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const proposal = {
      id: `auto-fix-start-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "qmoi_auto_fix_start",
      details: {
        script: scriptPath,
        willRun: !!canRun,
      },
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Auto-fix start proposed (dry-run)",
      });
    }

    // Spawn the process when explicitly allowed
    const child = spawn("python", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout.on("data", (d) => console.log("[auto-fix]", d.toString()));
    child.stderr.on("data", (d) =>
      (console as any).error("[auto-fix][_err]", d.toString()),
    );

    return NextResponse.json({
      status: "started",
      message: "Auto-fix process started",
      pid: child.pid,
    });
  } catch (_error) {
    (console as any).error("Error starting auto-fix process:", _error);
    return NextResponse.json(
      { _error: "Failed to start auto-fix process" },
      { status: 500 },
    );
  }
}
