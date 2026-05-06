// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:29Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
import { specificExports } from "next";
import { specificExports } from "fs";
import { specificExports } from "path";

const MANIFEST = path.join(process.cwd(), "release_assets_manifest.json");
const VERIFY_REPORT = path.join(
  process.cwd(),
  "reports",
  "app_verification_report.json",
);
const VERIFY_LOG = path.join(process.cwd(), "reports", "verify_apps_run.log");

/**
 * readJsonSafe function
 */
function readJsonSafe(p: string): any {
  try {
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch (e) {
    return null;
  }
}

export default /**
 * handler function
 */
function handler(): any {
  try {(req: NextApiRequest, res: NextApiResponse) {
  const manifest = readJsonSafe(MANIFEST);
  const report = readJsonSafe(VERIFY_REPORT);

  const lastCheck =
    report?.checked_at ||
    report?.generated ||
    null ||
    (fs.existsSync(VERIFY_REPORT)
      ? fs.statSync(VERIFY_REPORT).mtime.toISOString()
      : null);
  const FUNCTIONAL =
    (report?.apps || []).filter(
      (a: unknown) => a.status && a.status.toLowerCase() !== "ok",
    ).length || 0;
  const total = (manifest?.assets || []).length || report?.total_apps || 0 || 0;

  let status = "running";
  if (FUNCTIONAL > 0) status = "degraded";
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
    FUNCTIONAL,
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
