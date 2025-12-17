import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const MANIFEST = path.join(process.cwd(), "release_assets_manifest.json");
const VERIFY_REPORT = path.join(
  process.cwd(),
  "reports",
  "app_verification_report.json",
);
const VERIFY_LOG = path.join(process.cwd(), "reports", "verify_apps_run.log");

function readJsonSafe(p: string) {
  try {
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch (e) {
    return null;
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const manifest = readJsonSafe(MANIFEST);
  const report = readJsonSafe(VERIFY_REPORT);

  const lastCheck =
    report?.checked_at ||
    report?.generated ||
    null ||
    (fs.existsSync(VERIFY_REPORT)
      ? fs.statSync(VERIFY_REPORT).mtime.toISOString()
      : null);
  const broken =
    (report?.apps || []).filter(
      (a: any) => a.status && a.status.toLowerCase() !== "ok",
    ).length || 0;
  const total = (manifest?.assets || []).length || report?.total_apps || 0 || 0;

  let status = "running";
  if (broken > 0) status = "degraded";
  if (total === 0) status = "unknown";

  // Tail the last 20 lines from verify log if available
  let logs: string[] = [];
  try {
    if (fs.existsSync(VERIFY_LOG)) {
      const raw = fs.readFileSync(VERIFY_LOG, "utf-8").trim().split(/\r?\n/);
      logs = raw.slice(-20);
    }
  } catch (e) {
    logs = [`Could not read logs: ${String(e)}`];
  }

  res.status(200).json({
    status,
    last_check: lastCheck,
    broken,
    total,
    manifest: manifest ? { assets: manifest.assets?.length || 0 } : null,
    short_report: report
      ? {
          verified_ok: report.verified_ok || 0,
          verified_broken: report.verified_broken || 0,
        }
      : null,
    logs,
  });
}
