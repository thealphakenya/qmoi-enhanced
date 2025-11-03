/**
 * Mail adapter (conservative scaffold)
 * Behavior: dry-run by default — all intents are audited to `.qmoi_validation/adapter-audit.log`.
 * To enable real sending, set environment variables:
 *   - PRODUCTION_CONFIRMED=true
 *   - QMOI_ALLOW_NETWORK=true
 *   - SENDGRID_API_KEY (or other provider keys) and implement provider call below.
 */
import fs from 'fs';
import path from 'path';

const AUDIT_PATH = path.resolve(process.cwd(), '.qmoi_validation', 'adapter-audit.log');

async function appendAudit(entry) {
  try {
    await fs.promises.mkdir(path.dirname(AUDIT_PATH), { recursive: true });
    await fs.promises.appendFile(AUDIT_PATH, JSON.stringify(entry) + '\n');
  } catch (err) {
    // best-effort audit; do not throw
    console.error('Failed to write adapter audit:', err);
  }
}

export default async function handler(req, res) {
  const timestamp = new Date().toISOString();
  const productionEnabled = process.env.PRODUCTION_CONFIRMED === 'true' && process.env.QMOI_ALLOW_NETWORK === 'true';
  const hasProvider = !!process.env.SENDGRID_API_KEY;

  const audit = { ts: timestamp, adapter: 'mail', method: req.method, body: req.body || null, query: req.query || null, productionEnabled, hasProvider };
  await appendAudit(audit);

  if (!productionEnabled || !hasProvider) {
    return res.status(200).json({ dryRun: true, message: 'Dry-run: mail adapter not enabled or missing provider keys', audit });
  }

  // Placeholder for production action (not implemented). Keep safe and require explicit provider wiring.
  await appendAudit({ ts: new Date().toISOString(), adapter: 'mail', note: 'production path reached but provider wiring not implemented' });
  return res.status(501).json({ dryRun: false, message: 'Production mail sending not implemented in this scaffold. Set SENDGRID_API_KEY and implement provider call.', audit });
}
