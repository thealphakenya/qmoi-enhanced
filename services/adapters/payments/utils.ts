import { createHmac, timingSafeEqual } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IDEMPOTENCY_FILE = path.join(__dirname, '..', '..', 'data', 'payments_idempotency.json');

function ensureIdempotencyFile() {
  const dir = path.dirname(IDEMPOTENCY_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(IDEMPOTENCY_FILE)) {
    fs.writeFileSync(IDEMPOTENCY_FILE, '[]', 'utf-8');
  }
}

export function verifyWebhookSignature(payload: string | Buffer, signatureHeader: string | undefined, secret: string) {
  if (!signatureHeader || !secret) return false;
  const expected = createHmac('sha256', secret).update(payload).digest('hex');
  return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signatureHeader, 'hex'));
}

export function markIdempotent(key: string, record: unknown) {
  ensureIdempotencyFile();
  const raw = fs.readFileSync(IDEMPOTENCY_FILE, 'utf-8');
  const arr = JSON.parse(raw) as Array<{ key: string; record: unknown; ts: string }>;
  if (arr.find((item) => item.key === key)) return false;
  arr.push({ key, record, ts: new Date().toISOString() });
  fs.writeFileSync(IDEMPOTENCY_FILE, JSON.stringify(arr, null, 2), 'utf-8');
  return true;
}

export function getIdempotent(key: string) {
  ensureIdempotencyFile();
  const raw = fs.readFileSync(IDEMPOTENCY_FILE, 'utf-8');
  const arr = JSON.parse(raw) as Array<{ key: string; record: unknown; ts: string }>;
  return arr.find((item) => item.key === key);
}
