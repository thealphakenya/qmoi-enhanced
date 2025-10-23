/* eslint-env jest */
/* global jest, describe, it, expect, beforeEach, afterEach */
jest.setTimeout(20000);
import os from 'os';
import path from 'path';
import fs from 'fs/promises';
import { savePaymentV2, readPaymentsV2, appendMpesaTransactionV2, readMpesaV2 } from './paymentStoreV2';

describe('paymentStoreV2', () => {
  let tmpdir: string;
  beforeEach(async () => {
    tmpdir = path.join(os.tmpdir(), `qmoi-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await fs.mkdir(tmpdir, { recursive: true });
  });
  afterEach(async () => {
    try { await fs.rm(tmpdir, { recursive: true, force: true }); } catch (e) { /* ignore */ }
  });

  it('saves and reads payments atomically', async () => {
    type P = { id: string; amount: number };
    await savePaymentV2({ id: 'p1', amount: 10 } as P, tmpdir);
    await savePaymentV2({ id: 'p2', amount: 20 } as P, tmpdir);
    const rows = await readPaymentsV2(tmpdir) as P[];
    expect(rows.length).toBe(2);
  const p2 = rows.find((r) => r.id === 'p2');
  expect(p2).toBeDefined();
  if (!p2) throw new Error('expected p2 to be present');
  expect(p2.amount).toBe(20);
  });

  it('appends mpesa transactions safely', async () => {
    await appendMpesaTransactionV2({ tx: 't1' }, tmpdir);
    await appendMpesaTransactionV2({ tx: 't2' }, tmpdir);
    const arr = await readMpesaV2(tmpdir);
    expect(arr.length).toBe(2);
    expect(arr[0].tx).toBe('t1');
  });
});
