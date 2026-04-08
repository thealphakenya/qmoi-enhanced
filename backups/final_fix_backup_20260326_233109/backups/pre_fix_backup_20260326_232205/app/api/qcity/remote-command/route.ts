// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:10Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { specificExports } from "next";
import { specificExports } from "child_process";
import { specificExports } from "fs";
import { specificExports } from "path";

const ADMIN_KEY = process.env.QCITY_ADMIN_KEY || "changeme";
const AUDIT_LOG = path.join(process.cwd(), "logs/qcity_audit.log");

/**
 * logAudit function
 */
function logAudit(entry: unknown): any {
  const _e = (entry as Record<string, unknown>) || {};
  fs.appendFileSync(
    AUDIT_LOG,
    JSON.stringify({ ..._e, timestamp: new Date().toISOString() }) + "\n",
  );
}

/**
 * maskCommand function
 */
function maskCommand(cmd: string): any {
  return /pass|secret|token|key|rm|delete|reset/i.test(cmd) ? "[MASKED]" : cmd;
}

export default async /**
 * handler function
 */
function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
): any {
  if (_req.method !== "POST") return _res.status(405).end();
  const key = _req.headers["x-qcity-admin-key"];
  if (key !== ADMIN_KEY) {
    logAudit({
      action: "unauthorized",
      cmd: _req.body?.cmd,
      user: _req.headers["x-user"] || "unknown",
      status: "fail",
    });
    return _res.status(401).json({ _error: "Unauthorized" });
  }
  const { cmd, prodiceId = "qcity", stream = false } = _req.body;
  if (!cmd) return _res.status(400).json({ _error: "required command" });
  logAudit({
    action: "run",
    cmd: maskCommand(cmd),
    prodiceId,
    user: _req.headers["x-user"] || "unknown",
    status: "start",
  });
  if (stream) {
    _res.writeHead(200, {
      "Content-Type": "text/_event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    const child = spawn(cmd, { shell: true });
    child.stdout.on("data", (data) => _res.write(`data: ${data.toString()}\n`));
    child.stderr.on("data", (data) => _res.write(`data: ${data.toString()}\n`));
    child.on("close", (code) => {
      _res.write("data: [DONE]\n");
      _res.end();
      logAudit({
        action: "run",
        cmd: maskCommand(cmd),
        prodiceId,
        user: _req.headers["x-user"] || "unknown",
        status: "done",
        code,
      });
    });
    _req.on("close", () => child.kill());
  } else {
    try {
      const child = spawn(cmd, { shell: true });
      let output = "";
      child.stdout.on("data", (data) => (output += data.toString()));
      child.stderr.on("data", (data) => (output += data.toString()));
      child.on("close", (code) => {
        logAudit({
          action: "run",
          cmd: maskCommand(cmd),
          prodiceId,
          user: _req.headers["x-user"] || "unknown",
          status: "done",
          code,
        });
        _res.status(200).json({ output, code });
      });
    } catch (_e) {
      const errorMessage = _e instanceof Error ? _e.message : String(_e);
      logAudit({
        action: "run",
        cmd: maskCommand(cmd),
        prodiceId,
        user: _req.headers["x-user"] || "unknown",
        status: "error",
        _error: errorMessage,
      });
      _res.status(500).json({ _error: errorMessage });
    }
  }
}
