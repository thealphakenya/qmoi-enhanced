import fs from "fs";
import path from "path";
import { writeProposal } from "lib/proposals";

// Basic adapter interface
export interface WalletAdapter {
  name: string;
  getBalance(): Promise<{ amount: number; currency: string }>;
  isTestnet?: boolean;
  // Optional operations adapters may implement for richer features
  requestTrade?: (
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) => Promise<string>;
  approveTrade?: (tradeId: string, auto?: boolean) => Promise<boolean>;
}

// Mock adapter used when no credentials or for testnets
export class MockAdapter implements WalletAdapter {
  name: string;
  isTestnet: boolean;
  constructor(name: string, isTestnet = true) {
    this.name = name;
    this.isTestnet = isTestnet;
  }

  async getBalance() {
    // return a deterministic mock balance for reproducibility
    return { amount: 100.0, currency: "USD" };
  }
}

// Example Testnet adapter (placeholder for real SDK integrations)
export class TestnetAdapter implements WalletAdapter {
  name: string;
  isTestnet = true;
  private opts: any;

  constructor(name: string, opts?: any) {
    this.name = name;
    this.opts = opts || {};
  }
  async getBalance() {
    // Safer testnet behavior: if no apiKey provided, return a deterministic local mock balance
    if (!this.opts || !this.opts.apiKey) {
      // deterministic pseudo-random based on adapter name so tests are reproducible
      let hash = 0;
      for (let i = 0; i < this.name.length; i++)
        hash = (hash << 5) - hash + this.name.charCodeAt(i);
      const amount = (Math.abs(hash) % 1000) + 10; // between 10 and ~1009
      return { amount, currency: "USD" };
    }

    // If API key present, adapters may implement a live testnet call. Keep this minimal and safe.
    try {
      // Placeholder for real SDK integration. Return a small testnet balance by default.
      return { amount: 100.0, currency: "USDT" };
    } catch (err) {
      // Fall back to safe deterministic mock on failure
      return { amount: 0, currency: "USD" };
    }
  }

  // Optional: simulate trade request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    const id = `test-${this.name}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    return true;
  }
}

// Helper to mask API keys in proposals
function _maskSecret(s: string | null | undefined) {
  if (!s) return null;
  if (s.length <= 8) return "*****";
  return s.slice(0, 4) + "*".repeat(Math.max(4, s.length - 8)) + s.slice(-4);
}

// Cashon adapter: proposal-first behavior. When apiKey present but not allowed to run
// real calls, a proposal file is written to `.qmoi_validation/` describing the intent.
export class CashonAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: any;

  constructor(name = "cashon", opts?: any) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      this.opts.apiKey ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl = this.opts.apiUrl || process.env.CASHON_API_URL || null;

    if (!apiKey) {
      // deterministic mock when no credentials available
      let hash = 0;
      for (let i = 0; i < this.name.length; i++)
        hash = (hash << 5) - hash + this.name.charCodeAt(i);
      const amount = (Math.abs(hash) % 500) + 5;
      return { amount, currency: "USD", status: "mock" };
    }

    // Prepare proposal payload
    const payload = {
      adapter: "cashon",
      api_url: apiUrl || "unknown",
      api_key_masked: _maskSecret(apiKey),
    };
    const prop = await writeProposal({
      title: "check-balance-cashon",
      description: "Dry-run: check Cashon real balance",
      payload,
    });

    // Only perform real calls when explicitly allowed via env flags
    const prod =
      (process.env.PRODUCTION_CONFIRMED || "").toLowerCase() === "true";
    const allow =
      (process.env.ALLOW_REAL_ACTIONS || "").toLowerCase() === "true";
    if (!prod || !allow) {
      return {
        amount: 0,
        currency: "USD",
        status: "proposal_written",
        proposal: prop,
      };
    }

    // If allowed, attempt a minimal fetch if global fetch exists; otherwise return a network_not_available status
    try {
      if (typeof (global as any).fetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (global as any).fetch(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await r.json();
        // Expecting { balance: number, currency: string }
        return {
          amount: j.balance || 0,
          currency: j.currency || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (err) {
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        error: String(err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: any;

  constructor(name = "megavault", opts?: any) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      this.opts.apiKey ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl = this.opts.apiUrl || process.env.MEGAVAULT_API_URL || null;

    if (!apiKey) {
      // deterministic mock when no credentials available
      let hash = 0;
      for (let i = 0; i < this.name.length; i++)
        hash = (hash << 5) - hash + this.name.charCodeAt(i);
      const amount = (Math.abs(hash) % 800) + 1;
      return { amount, currency: "USD", status: "mock" };
    }

    const payload = {
      adapter: "megavault",
      api_url: apiUrl || "unknown",
      api_key_masked: _maskSecret(apiKey),
    };
    const prop = await writeProposal({
      title: "check-balance-megavault",
      description: "Dry-run: check Megavault real balance",
      payload,
    });

    const prod =
      (process.env.PRODUCTION_CONFIRMED || "").toLowerCase() === "true";
    const allow =
      (process.env.ALLOW_REAL_ACTIONS || "").toLowerCase() === "true";
    if (!prod || !allow) {
      return {
        amount: 0,
        currency: "USD",
        status: "proposal_written",
        proposal: prop,
      };
    }

    try {
      if (typeof (global as any).fetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (global as any).fetch(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await r.json();
        return {
          amount: j.balance || 0,
          currency: j.currency || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (err) {
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        error: String(err),
      };
    }
  }
}

// WalletService: orchestrates adapters, currency normalization, state storage
export class WalletService {
  adapters: Map<string, WalletAdapter> = new Map();
  stateDir: string;
  stateFile: string;

  constructor(stateDir = ".qmoi_state") {
    this.stateDir = stateDir;
    this.stateFile = path.join(this.stateDir, "wallets.json");
    if (!fs.existsSync(this.stateDir))
      fs.mkdirSync(this.stateDir, { recursive: true });
    if (!fs.existsSync(this.stateFile))
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify({ wallets: {} }, null, 2),
      );
  }

  registerAdapter(adapter: WalletAdapter) {
    this.adapters.set(adapter.name, adapter);
  }

  getAdapter(name: string) {
    return this.adapters.get(name);
  }

  async getAllBalances(): Promise<Record<string, any>> {
    const out: Record<string, any> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (err) {
        out[name] = { error: String(err) };
      }
    }
    // persist snapshot
    this.persistSnapshot(out);
    return out;
  }

  async convertToCanonical(amount: number, currency: string) {
    // For now canonical currency is USD; this function uses a mocked fixed rate table
    const rates: Record<string, number> = {
      USD: 1,
      USDT: 1,
      EUR: 1.1,
      KES: 0.007,
    }; // simple mock
    const rate = rates[currency] || 1;
    return { amount: amount * rate, currency: "USD" };
  }

  persistSnapshot(snapshot: Record<string, any>) {
    try {
      const data = JSON.parse(fs.readFileSync(this.stateFile, "utf8") || "{}");
      if (!data.history) data.history = [];
      data.history.push({ ts: new Date().toISOString(), snapshot });
      fs.writeFileSync(this.stateFile, JSON.stringify(data, null, 2), "utf8");
    } catch (err) {
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(
          { history: [{ ts: new Date().toISOString(), snapshot }] },
          null,
          2,
        ),
        "utf8",
      );
    }
  }

  loadCredentials(name: string) {
    // Load credentials from environment variables or state file
    // Example: WALLET_<NAME>_API_KEY
    const key = process.env[`WALLET_${name.toUpperCase()}_API_KEY`];
    if (key) return { apiKey: key };

    try {
      const s = JSON.parse(fs.readFileSync(this.stateFile, "utf8") || "{}");
      return s.wallets && s.wallets[name] ? s.wallets[name].creds : null;
    } catch (err) {
      return null;
    }
  }

  saveWalletState(name: string, meta: any) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const data = JSON.parse(raw || "{}");
    data.wallets = data.wallets || {};
    data.wallets[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(data, null, 2), "utf8");
  }
}

export default WalletService;
