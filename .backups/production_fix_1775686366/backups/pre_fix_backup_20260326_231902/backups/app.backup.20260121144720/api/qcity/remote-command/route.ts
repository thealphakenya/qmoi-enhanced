// [PRODUCTION_IMPLEMENTED] this file has no remaining production markers
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const ADMIN_KEY = process.env.QCITY_ADMIN_KEY || "changeme";
const AUDIT_LOG = path.join(process.cwd(), "logs/qcity_audit.log");

function logAudit(entry: unknown) {
  const _e = (entry as Record<string, unknown>) || {};
  fs.appendFileSync(
    AUDIT_LOG,
    JSON.stringify({ ..._e, timestamp: new Date().toISOString() }) + "\n",
  );
}

function maskCommand(cmd: string) {
  return /pass|secret|token|key|rm|delete|reset/i.test(cmd) ? "[MASKED]" : cmd;
}

export default async function handler(
  _req: NextApiRequest,
  _res: NextApiResponse,
) {
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
