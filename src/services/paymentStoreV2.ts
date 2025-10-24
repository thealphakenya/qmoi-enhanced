import fs from 'fs/promises';
import path from 'path';

const DEFAULT_DATA_DIR = path.resolve(process.cwd(), process.env.DATA_DIR || 'data');

const fileLocks: Record<string, Promise<void>> = {};

function lockFor(file: string) {
  const prev = fileLocks[file] || Promise.resolve();
  let release: (() => void) | undefined;
  const p = new Promise<void>((res) => { release = res; });
  // wait should be the previous promise; the new fileLocks[file] will be prev.then(() => p)
  const wait = prev;
  fileLocks[file] = prev.then(() => p);
  return { wait, release: () => { if (release) release(); } };
}

async function ensureFile(filePath: string, initial = '[]') {
  try { await fs.mkdir(path.dirname(filePath), { recursive: true }); } catch (e) { /* ignore */ }
  try { await fs.access(filePath); } catch (e) { await fs.writeFile(filePath, initial, 'utf8'); }
}

async function atomicWrite(filePath: string, data: string) {
  const tmp = `${filePath}.${Date.now()}.${Math.random().toString(36).slice(2)}`;
  await fs.writeFile(tmp, data, 'utf8');
  await fs.rename(tmp, filePath);
}

const PAYMENTS_FILE = (dir = DEFAULT_DATA_DIR) => path.join(dir, 'payments.json');
const MPESA_FILE = (dir = DEFAULT_DATA_DIR) => path.join(dir, 'mpesa-transactions.json');

export async function readArray(filePath: string) {
  await ensureFile(filePath);
  const txt = await fs.readFile(filePath, 'utf8');
  try { return JSON.parse(txt); } catch (e) { return []; }
}

export async function appendToArray(filePath: string, item: unknown) {
  const lk = lockFor(filePath);
  await lk.wait;
  try {
    const arr = await readArray(filePath) as unknown[];
    arr.push(item);
    await atomicWrite(filePath, JSON.stringify(arr, null, 2));
    return item;
  } finally {
    lk.release();
  }
}

export async function writeArray(filePath: string, arr: unknown[]) {
  const lk = lockFor(filePath);
  await lk.wait;
  try {
    await atomicWrite(filePath, JSON.stringify(arr, null, 2));
  } finally {
    lk.release();
  }
}

export async function savePaymentV2(payment: unknown, dataDir?: string) {
  const file = PAYMENTS_FILE(dataDir);
  await ensureFile(file);
  return appendToArray(file, payment);
}

export async function appendMpesaTransactionV2(tx: unknown, dataDir?: string) {
  const file = MPESA_FILE(dataDir);
  await ensureFile(file);
  return appendToArray(file, tx);
}

export async function readPaymentsV2(dataDir?: string) {
  return readArray(PAYMENTS_FILE(dataDir));
}

export async function readMpesaV2(dataDir?: string) {
  return readArray(MPESA_FILE(dataDir));
}

export async function updatePaymentV2(id: string, updates: unknown, dataDir?: string) {
  const file = PAYMENTS_FILE(dataDir);
  const lk = lockFor(file);
  await lk.wait;
  try {
  type Payment = { id?: string; checkoutRequestId?: string; result?: unknown } & Record<string, unknown>;
    const arr = await readArray(file) as Payment[];
    const idx = arr.findIndex((p) => p.id === id || p.checkoutRequestId === id);
    if (idx === -1) return null;
    const u = updates as Partial<Payment>;
    arr[idx] = Object.assign({}, arr[idx], u);
    await atomicWrite(file, JSON.stringify(arr, null, 2));
    return arr[idx];
  } finally {
    lk.release();
  }
}

export async function findPaymentByReferenceV2(ref: string, dataDir?: string) {
  type Payment = { checkoutRequestId?: string; result?: unknown } & Record<string, unknown>;
  const arr = await readArray(PAYMENTS_FILE(dataDir)) as Payment[];
  return arr.find((p) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = p.result as any;
    return (r && (r.reference === ref || (r.raw && r.raw.CheckoutRequestID === ref))) || p.checkoutRequestId === ref;
  });
}

export default {
  savePaymentV2,
  appendMpesaTransactionV2,
  readPaymentsV2,
  readMpesaV2,
};
