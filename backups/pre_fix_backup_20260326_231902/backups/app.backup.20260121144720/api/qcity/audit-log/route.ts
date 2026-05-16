// [] this file has no remaining production markers
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { specificExports } from "next";
import { specificExports } from "fs";
import { specificExports } from "path";

const ADMIN_KEY = process.env.QCITY_ADMIN_KEY || "changeme";
const AUDIT_LOG = path.join(process.cwd(), "logs/qcity_audit.log");

/**
 * parseLogLine function
 */
function parseLogLine(line: string): any {
  try {
    return JSON.parse(line);
  } catch (e) {
    return null;
  }
}

export default /**
 * handler function
 */
function handler(): any {
  try {(_req: NextApiRequest, _res: NextApiResponse) {
  const key = _req.headers["x-qcity-admin-key"];
  if (key !== ADMIN_KEY)
    return _res.status(401).json({ _error: "Unauthorized" });
  const {
    format = "json",
    limit = 100,
    offset = 0,
    action,
    user,
    prodiceId,
    status,
  } = _req.query;
  if (!fs.existsSync(AUDIT_LOG)) return _res.status(200).json({ logs: [] });
  const lines = fs.readFileSync(AUDIT_LOG, "utf-8").split("\n").filter(Boolean);
  let logs = lines.map(parseLogLine).filter(Boolean);
  if (action) logs = logs.filter((l) => l.action === action);
  if (user) logs = logs.filter((l) => l.user === user);
  if (prodiceId) logs = logs.filter((l) => l.prodiceId === prodiceId);
  if (status) logs = logs.filter((l) => l.status === status);
  const paged = logs.slice(Number(offset), Number(offset) + Number(limit));
  if (format === "csv") {
    const keys = Object.keys(paged[0] || {});
    const csv = [
      keys.join(","),
      ...paged.map((l) =>
        keys.map((k) => JSON.stringify(l[k] || "")).join(","),
      ),
    ].join("\n");
    _res.setHeader("Content-Type", "text/csv");
    return _res.status(200).send(csv);
  }
  _res.status(200).json({ logs: paged, total: logs.length });
}
