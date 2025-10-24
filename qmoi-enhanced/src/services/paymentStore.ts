import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');
const MPESA_FILE = path.join(DATA_DIR, 'mpesa-transactions.json');

async function ensureFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {
    // ignore
  }

  try {
    await fs.access(PAYMENTS_FILE);
  } catch (e) {
    await fs.writeFile(PAYMENTS_FILE, '[]', 'utf8');
  }

  try {
    await fs.access(MPESA_FILE);
  } catch (e) {
    await fs.writeFile(MPESA_FILE, '[]', 'utf8');
  }
}

async function readPayments(): Promise<any[]> {
  await ensureFiles();
  const txt = await fs.readFile(PAYMENTS_FILE, 'utf8');
  try { return JSON.parse(txt); } catch (e) { return []; }
}

async function writePayments(items: any[]) {
  await ensureFiles();
  await fs.writeFile(PAYMENTS_FILE, JSON.stringify(items, null, 2), 'utf8');
}

export async function savePayment(payment: any) {
  const items = await readPayments();
  items.push(payment);
  await writePayments(items);
  return payment;
}

export async function updatePayment(id: string, updates: any) {
  const items = await readPayments();
  const idx = items.findIndex((p: any) => p.id === id || p.checkoutRequestId === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...updates };
  await writePayments(items);
  return items[idx];
}

export async function findPaymentByReference(ref: string) {
  const items = await readPayments();
  return items.find((p: any) => p.result?.reference === ref || p.checkoutRequestId === ref || p.result?.raw?.CheckoutRequestID === ref);
}

export async function getPayments(filter?: any) {
  const items = await readPayments();
  if (!filter) return items;
  return items.filter((p: any) => {
    for (const k of Object.keys(filter)) {
      if (p[k] !== filter[k]) return false;
    }
    return true;
  });
}

export async function appendMpesaTransaction(tx: any) {
  await ensureFiles();
  const txt = await fs.readFile(MPESA_FILE, 'utf8');
  let arr = [];
  try { arr = JSON.parse(txt); } catch (e) { arr = []; }
  arr.push(tx);
  await fs.writeFile(MPESA_FILE, JSON.stringify(arr, null, 2), 'utf8');
  return tx;
}

export default {
  savePayment,
  updatePayment,
  findPaymentByReference,
  getPayments,
  appendMpesaTransaction,
};
