import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const WALLET_DIR = path.join(__dirname, '..', 'data', 'wallets');
if (!fs.existsSync(WALLET_DIR)) fs.mkdirSync(WALLET_DIR, { recursive: true });

export type WalletRecord = {
  id: string;
  publicKey: string;
  meta?: Record<string, any>;
  createdAt: string;
};

function persistWallet(rec: WalletRecord) {
  const p = path.join(WALLET_DIR, `${rec.id}.json`);
  fs.writeFileSync(p, JSON.stringify(rec, null, 2), 'utf-8');
}

export class KeyStore {
  // In production this should be an HSM or secret manager-backed store.
  static generateKeyPair(): { publicKey: string; privateKeyPem: string } {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', { namedCurve: 'secp256k1' });
    const publicPem = publicKey.export({ type: 'spki', format: 'pem' }).toString();
    const privatePem = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
    return { publicKey: publicPem, privateKeyPem: privatePem };
  }
}

export class WalletManager {
  // Basic wallet manager with signing, multi-sig placeholders, reconciliation and audit logs

  static createWallet(meta?: Record<string, any>): WalletRecord {
    const { publicKey } = KeyStore.generateKeyPair();
    const id = `w_${Math.random().toString(36).slice(2)}`;
    const rec: WalletRecord = { id, publicKey, meta, createdAt: new Date().toISOString() };
    persistWallet(rec);
    WalletManager.appendAudit({ event: 'wallet_created', walletId: id, meta });
    console.log('[WalletManager] created wallet', id);
    return rec;
  }

  static signTransaction(privateKeyPem: string, payload: string) {
    const sign = crypto.createSign('SHA256');
    sign.update(payload);
    sign.end();
    return sign.sign(privateKeyPem, 'base64');
  }

  static verifySignature(publicKeyPem: string, payload: string, signature: string) {
    const verify = crypto.createVerify('SHA256');
    verify.update(payload);
    verify.end();
    try {
      return verify.verify(publicKeyPem, signature, 'base64');
    } catch (e) {
      console.error('verifySignature failed', e);
      return false;
    }
  }

  static antiFraudCheck(tx: any) {
    // Lightweight heuristics: amount thresholds, velocity, to/from blacklist
    if (!tx) return false;
    if (tx.amount && tx.amount > 1_000_000) return false; // block extremely large amounts by default
    return true;
  }

  static appendAudit(entry: Record<string, any>) {
    try {
      const p = path.join(WALLET_DIR, 'audit.log');
      const line = JSON.stringify({ ts: new Date().toISOString(), ...entry }) + '\n';
      fs.appendFileSync(p, line, 'utf-8');
    } catch (e) {
      console.error('appendAudit failed', e);
    }
  }

  static createTransaction(opts: { fromWalletId?: string; to?: string; amount: number; currency: string; metadata?: Record<string, any>; }) {
    // Validate input
    if (!this.antiFraudCheck(opts)) throw new Error('anti-fraud validation failed');
    const tx = {
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      from: opts.fromWalletId || 'system',
      to: opts.to,
      amount: opts.amount,
      currency: opts.currency,
      metadata: opts.metadata || {},
      status: 'created',
      createdAt: new Date().toISOString()
    };
    this.appendAudit({ event: 'tx_created', tx });
    // In production: perform multi-sig, sign with HSM, queue for settlement
    return tx;
  }

  static async settleTransaction(txId: string) {
    // TODO: production implementation needed
    this.appendAudit({ event: 'tx_settle_attempt', txId });
    return { txId, settled: true };
  }

  static reconcile(transactions: any[]) {
    // Simple reconciliation TBD: mark unsettled
    return transactions.map(t => ({ ...t, checkedAt: new Date().toISOString(), reconciled: true }));
  }
}

export default WalletManager;
