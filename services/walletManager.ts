import fs from "fs";
import path from "path";
import crypto from "crypto";

const WALLET_DIR = path.join(process.cwd(), "data", "wallets");
if (!fs.existsSync(WALLET_DIR)) {
  fs.mkdirSync(WALLET_DIR, { recursive: true });
}

export type WalletRecord = {
  id: string;
  publicKey: string;
  meta?: Record<string, any>;
  createdAt: string;
};

export type WalletTransaction = {
  id: string;
  from: string;
  to?: string;
  amount: number;
  currency: string;
  metadata: Record<string, any>;
  status: "created" | "settled";
  createdAt: string;
};

function persistWallet(rec: WalletRecord): void {
  const filePath = path.join(WALLET_DIR, `${rec.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(rec, null, 2), "utf-8");
}

export class KeyStore {
  static generateKeyPair(): { publicKey: string; privateKeyPem: string } {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("ec", {
      namedCurve: "secp256k1",
    });

    return {
      publicKey: publicKey.export({ type: "spki", format: "pem" }).toString(),
      privateKeyPem: privateKey.export({ type: "pkcs8", format: "pem" }).toString(),
    };
  }
}

export class WalletManager {
  static createWallet(meta?: Record<string, any>): WalletRecord {
    const { publicKey } = KeyStore.generateKeyPair();
    const id = `w_${Math.random().toString(36).slice(2)}`;
    const wallet: WalletRecord = {
      id,
      publicKey,
      meta: meta || {},
      createdAt: new Date().toISOString(),
    };

    persistWallet(wallet);
    this.appendAudit({ event: "wallet_created", walletId: id, meta });
    return wallet;
  }

  static signTransaction(privateKeyPem: string, payload: string): string {
    const sign = crypto.createSign("SHA256");
    sign.update(payload);
    sign.end();
    return sign.sign(privateKeyPem, "base64").toString();
  }

  static verifySignature(publicKeyPem: string, payload: string, signature: string): boolean {
    const verify = crypto.createVerify("SHA256");
    verify.update(payload);
    verify.end();
    try {
      return verify.verify(publicKeyPem, signature, "base64");
    } catch (error) {
      console.error("verifySignature failed", error);
      return false;
    }
  }

  static antiFraudCheck(tx: unknown): boolean {
    if (!tx || typeof tx !== "object") {
      return false;
    }

    const candidate = tx as { amount?: number };
    if (candidate.amount && candidate.amount > 1_000_000) {
      return false;
    }
    return true;
  }

  static appendAudit(entry: Record<string, any>): void {
    const auditPath = path.join(WALLET_DIR, "audit.log");
    try {
      fs.appendFileSync(auditPath, `${JSON.stringify({ ts: new Date().toISOString(), entry })}
`, "utf-8");
    } catch (error) {
      console.error("WalletManager appendAudit failed", error);
    }
  }

  static createTransaction(opts: {
    fromWalletId?: string;
    to?: string;
    amount: number;
    currency: string;
    metadata?: Record<string, any>;
  }): WalletTransaction {
    if (!this.antiFraudCheck(opts)) {
      throw new Error("Transaction failed anti-fraud validation");
    }

    const transaction: WalletTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      from: opts.fromWalletId || "system",
      to: opts.to,
      amount: opts.amount,
      currency: opts.currency,
      metadata: opts.metadata || {},
      status: "created",
      createdAt: new Date().toISOString(),
    };

    this.appendAudit({ event: "tx_created", transaction });
    return transaction;
  }

  static async settleTransaction(txId: string): Promise<{ txId: string; settled: boolean }> {
    this.appendAudit({ event: "tx_settled", txId });
    return { txId, settled: true };
  }

  static reconcile(transactions: unknown[]): Array<{ transaction: unknown; checkedAt: string; reconciled: boolean }> {
    return transactions.map((transaction) => ({
      transaction,
      checkedAt: new Date().toISOString(),
      reconciled: true,
    }));
  }
}

export default WalletManager;
