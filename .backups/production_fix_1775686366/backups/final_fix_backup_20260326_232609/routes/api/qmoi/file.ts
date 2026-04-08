// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:29Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const SAFE_ROOT = path.join(process.cwd(), "Qmoi_downloaded_apps");
const AUDIT_LOG = path.join(process.cwd(), "qmoi_file_audit.log");

function logAudit(entry: Record<string, any>) {
  try {
    fs.appendFileSync(AUDIT_LOG, JSON.stringify(entry) + "\n", "utf-8");
  } catch (e) {
    // best-effort logging; do not break primary flow
    (globalThis.console as any)?.error?.(
      "Failed to write audit log",
      e.message,
    );
  }
}

function isPathSafe(requestPath: string) {
  const normalized = path.normalize(requestPath);
  return (
    normalized.startsWith(SAFE_ROOT + path.sep) || normalized === SAFE_ROOT
  );
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simple token-based admin auth (set ADMIN_TOKEN in env)
  const adminToken = process.env.ADMIN_TOKEN || "";
  const provided =
    (req.headers["x-admin-token"] as string) ||
    req.query.admin_token ||
    req.body?.admin_token;
  if (!adminToken || provided !== adminToken) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

  const { action, filePath: relPath, content, replace } = req.body || {};
  if (typeof relPath !== "string" || !relPath) {
    res.status(400).json({ success: false, error: "filePath is required" });
    return;
  }

  const absPath = path.join(process.cwd(), relPath);
  if (!isPathSafe(absPath)) {
    res
      .status(403)
      .json({ success: false, error: "Access to this path is not allowed" });
    return;
  }

  const entryBase = {
    timestamp: new Date().toISOString(),
    user: "admin",
    action,
    filePath: relPath,
  };

  try {
    if (action === "read") {
      const data = fs.readFileSync(absPath, "utf-8");
      logAudit({ ...entryBase, result: "read", size: data.length });
      res.status(200).json({ success: true, data });
      return;
    }

    if (action === "write") {
      if (typeof content !== "string") {
        res
          .status(400)
          .json({ success: false, error: "content must be string" });
        return;
      }
      fs.writeFileSync(absPath, content, "utf-8");
      logAudit({ ...entryBase, result: "write", size: content.length });
      res.status(200).json({ success: true });
      return;
    }

    if (action === "append") {
      if (typeof content !== "string") {
        res
          .status(400)
          .json({ success: false, error: "content must be string" });
        return;
      }
      fs.appendFileSync(absPath, content, "utf-8");
      logAudit({ ...entryBase, result: "append", size: content.length });
      res.status(200).json({ success: true });
      return;
    }

    if (action === "replace") {
      if (typeof replace !== "string" || typeof content !== "string") {
        res.status(400).json({
          success: false,
          error: "replace and content must be strings",
        });
        return;
      }
      const data = fs.readFileSync(absPath, "utf-8");
      const newData = data.replace(new RegExp(replace, "g"), content);
      fs.writeFileSync(absPath, newData, "utf-8");
      logAudit({
        ...entryBase,
        result: "replace",
        replace,
        size: content.length,
      });
      res.status(200).json({ success: true });
      return;
    }

    res.status(400).json({ success: false, error: "Unknown action" });
  } catch (e: unknown) {
    logAudit({ ...entryBase, result: "error", error: e?.message });
    res
      .status(500)
      .json({ success: false, error: e?.message || "Internal error" });
  }
}
