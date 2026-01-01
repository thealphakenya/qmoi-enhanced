/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
/* global Request, Headers, Buffer, URLSearchParams, TextDecoder, TextEncoder */
import * as fs from "fs";
import * as path from "path";
import { requireRole } from "../auth/rbac";

const ADMIN_KEY = process.env.QCITY_ADMIN_KEY || "changeme";
const AUDIT_LOG_PATH = path.resolve(process.cwd(), "logs/qcity_audit.log");

const handler = requireRole(["admin", "master"])(async (_req: unknown, _res: unknown) => {
  const { method, _query } = _req;
  if (method !== "GET")
    return _res.status(405).json({ _error: "Method not allowed" });
  if (!fs.existsSync(AUDIT_LOG_PATH))
    return _res
      .status(200)
      .json({ items: [], total: 0, page: 1, pageSize: 50, totalPages: 1 });
  const raw = fs.readFileSync(AUDIT_LOG_PATH, "utf-8");
  const lines = raw.split("\n").filter(Boolean);
  let logs = lines
    .map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  // Filtering
  if (_query.user)
    logs = logs.filter((l: unknown) => l.user && l.user.includes(_query.user));
  if (_query.action)
    logs = logs.filter((l: unknown) => l.action && l.action.includes(_query.action));
  if (_query.status)
    logs = logs.filter((l: unknown) => l.status && l.status.includes(_query.status));
  if (_query.date)
    logs = logs.filter(
      (l: unknown) => l.timestamp && l.timestamp.startsWith(_query.date),
    );
  // Pagination
  const page = parseInt(_query.page) || 1;
  const pageSize = parseInt(_query.pageSize) || 50;
  const total = logs.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const items = logs.slice((page - 1) * pageSize, page * pageSize);
  // Export
  if (_query.export === "csv") {
    const header = "Timestamp,User,Action,Device,Status,Command";
    const rows = items.map((log: unknown) =>
      [
        log.timestamp,
        log.user,
        log.action,
        log.deviceId,
        log.status,
        log.command.replace(/"/g, '""'),
      ]
        .map((x) => `"${x || ""}"`)
        .join(","),
    );
    const csv = [header, ...rows].join("\n");
    _res.setHeader("Content-Type", "text/csv");
    _res.setHeader(
      "Content-Disposition",
      'attachment; filename="qmoi_audit_log.csv"',
    );
    return _res.status(200).send(csv);
  }
  if (_query.export === "json") {
    _res.setHeader("Content-Type", "application/json");
    _res.setHeader(
      "Content-Disposition",
      'attachment; filename="qmoi_audit_log.json"',
    );
    return _res.status(200).send(JSON.stringify(items, null, 2));
  }
  _res.status(200).json({ items, total, page, pageSize, totalPages });
});

export default handler;
