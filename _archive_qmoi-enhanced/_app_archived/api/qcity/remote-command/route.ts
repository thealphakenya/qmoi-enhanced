import { NextApiRequest, NextApiResponse } from "next";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const ADMIN_KEY = process.env.QCITY_ADMIN_KEY || "changeme";
const AUDIT_LOG = path.join(process.cwd(), "logs/qcity_audit.log");

function logAudit(entry: any) {
  fs.appendFileSync(
    AUDIT_LOG,
    JSON.stringify({ ...entry, timestamp: new Date().toISOString() }) + "\n",
  );
}

function maskCommand(cmd: string) {
  return /pass|secret|token|key|rm|delete|reset/i.test(cmd) ? "[MASKED]" : cmd;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();
  const key = req.headers["x-qcity-admin-key"];
  if (key !== ADMIN_KEY) {
    logAudit({
      action: "unauthorized",
      cmd: req.body?.cmd,
      user: req.headers["x-user"] || "unknown",
      status: "fail",
    });
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { cmd, deviceId = "qcity", stream = false } = req.body;
  if (!cmd) return res.status(400).json({ error: "Missing command" });
  logAudit({
    action: "run",
    cmd: maskCommand(cmd),
    deviceId,
    user: req.headers["x-user"] || "unknown",
    status: "start",
  });
  if (stream) {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    const child = spawn(cmd, { shell: true });
    child.stdout.on("data", (data) => res.write(`data: ${data.toString()}\n`));
    child.stderr.on("data", (data) => res.write(`data: ${data.toString()}\n`));
    child.on("close", (code) => {
      res.write("data: [DONE]\n");
      res.end();
      logAudit({
        action: "run",
        cmd: maskCommand(cmd),
        deviceId,
        user: req.headers["x-user"] || "unknown",
        status: "done",
        code,
      });
    });
    req.on("close", () => child.kill());
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
          deviceId,
          user: req.headers["x-user"] || "unknown",
          status: "done",
          code,
        });
        res.status(200).json({ output, code });
      });
    } catch (e) {
      logAudit({
        action: "run",
        cmd: maskCommand(cmd),
        deviceId,
        user: req.headers["x-user"] || "unknown",
        status: "error",
        error: e.message,
      });
      res.status(500).json({ error: e.message });
    }
  }
}
