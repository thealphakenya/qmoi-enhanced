---
title: "Issue draft for services/adapters/payments/utils.ts"
generated: 2025-11-08T16:06:39.002756Z
---

# Review needed: services/adapters/payments/utils.ts

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const IDEMPOTENCY_FILE = path.join(__dirname, '..', '..', 'data', 'payments_idempotency.json');
if (!fs.existsSync(IDEMPOTENCY_FILE)) fs.writeFileSync(IDEMPOTENCY_FILE, '[]', 'utf-8');

export function verifyWebhookSignature(payload: string | Buffer, signatureHeader: string | undefined, secret: string) {
  if (!signatureHeader || !secret) return false;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signatureHeader, 'hex'));
}

export function markIdempotent(key: string, record: any) {
  const raw = fs.readFileSync(IDEMPOTENCY_FILE, 'utf-8');
  const arr = JSON.parse(raw);
  if (arr.find((r: any) => r.key === key)) return false; // already exists
  arr.push({ key, record, ts: new Date().toISOString() });
  fs.writeFileSync(IDEMPOTENCY_FILE, JSON.stringify(arr, null, 2), 'utf-8');
  return true;
}

export function getIdempotent(key: string) {
  const raw = fs.readFileSync(IDEMPOTENCY_FILE, 'utf-8');
  const arr = JSON.parse(raw);
  return arr.find((r: any) => r.key === key);
}

```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
