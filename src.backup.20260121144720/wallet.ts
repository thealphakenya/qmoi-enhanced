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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:06.572095Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z

// AUTOFIXED by Ollama at 2026-07-26T19:39:17.601188Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/wallet.ts -->
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
  private opts: Record<string, unknown>;

  constructor(name: string, opts?: Record<string, unknown>) {
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
    // Placeholder for real SDK integration. Return a small testnet balance by default.
    return { amount: 100.0, currency: "USDT" };
  }

  // Optional: simulate trade _request on testnet (returns a fake trade id)
  async requestTrade(
    amount: number,
    asset: string,
    strategy?: string,
    confidence?: number,
  ) {
    void amount;
    void asset;
    void strategy;
    void confidence;

    const id = `test-${this.name}-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;
    // In a real adapter, you would call the testnet SDK here. We persist a lightweight entry in state if available.
    return id;
  }

  async approveTrade(tradeId: string, auto = false) {
    // Simulate approval always true on testnet adapter
    void auto;
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
  private opts: Record<string, unknown>;

  constructor(name = "cashon", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.CASHON_API_KEY ||
      process.env.WALLET_CASHON_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.CASHON_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.cashon.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        // Expecting { balance: number, currency: string }
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
      };
    }
  }
}

// Megavault adapter: similar proposal-first behavior
export class MegavaultAdapter implements WalletAdapter {
  name: string;
  isTestnet = false;
  private opts: Record<string, unknown>;

  constructor(name = "megavault", opts?: Record<string, unknown>) {
    this.name = name;
    this.opts = opts || {};
  }

  async getBalance() {
    const apiKey =
      ((this.opts as Record<string, unknown>).apiKey as string | undefined) ||
      process.env.MEGAVAULT_API_KEY ||
      process.env.WALLET_MEGAVAULT_API_KEY ||
      null;
    const apiUrl =
      ((this.opts as Record<string, unknown>).apiUrl as string | undefined) ||
      process.env.MEGAVAULT_API_URL ||
      null;

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
      const maybeFetch = (global as unknown as { fetch?: unknown }).fetch;
      if (typeof maybeFetch === "function") {
        const url = apiUrl || "https://api.megavault.example/v1/balance";
        const r = await (
          maybeFetch as (...args: unknown[]) => Promise<unknown>
        )(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const j = await (
          r as { json: () => Promise<Record<string, unknown>> }
        ).json();
        return {
          amount: (j.balance as number) || 0,
          currency: (j.currency as string) || "USD",
          status: "ok",
        };
      }
      return { amount: 0, currency: "USD", status: "network_not_available" };
    } catch (_err) {
      void _err;
      return {
        amount: 0,
        currency: "USD",
        status: "network_failed",
        _error: String(_err),
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

  async getAllBalances(): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = {};
    for (const [name, adapter] of this.adapters.entries()) {
      try {
        const b = await adapter.getBalance();
        const canonical = await this.convertToCanonical(b.amount, b.currency);
        out[name] = {
          native: b,
          canonical,
        };
      } catch (_err) {
        void _err;
        out[name] = { _error: String(_err) };
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

  persistSnapshot(snapshot: Record<string, unknown>) {
    try {
      const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
      const parsed: unknown = JSON.parse(raw || "{}");
      const dataObj =
        parsed && typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : {};
      const dataObjSafe = dataObj as Record<string, unknown>;
      if (!Array.isArray(dataObjSafe.history)) dataObjSafe.history = [];
      (dataObjSafe.history as unknown[]).push({
        ts: new Date().toISOString(),
        snapshot,
      });
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify(dataObjSafe, null, 2),
        "utf8",
      );
    } catch (_err) {
      void _err;
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
      const s: unknown = JSON.parse(
        fs.readFileSync(this.stateFile, "utf8") || "{}",
      );
      if (s && typeof s === "object") {
        const sObj = s as Record<string, unknown>;
        if (sObj.wallets && typeof sObj.wallets === "object") {
          const wallets = sObj.wallets as Record<string, unknown>;
          const entry = wallets[name] as Record<string, unknown> | undefined;
          return entry ? (entry.creds as Record<string, unknown> | null) : null;
        }
      }
      return null;
    } catch (_err) {
      void _err;
      return null;
    }
  }

  saveWalletState(name: string, meta: Record<string, unknown>) {
    const raw = fs.readFileSync(this.stateFile, "utf8") || "{}";
    const parsed: unknown = JSON.parse(raw || "{}");
    const dataObj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    dataObj.wallets = dataObj.wallets || {};
    (dataObj.wallets as Record<string, unknown>)[name] = meta;
    fs.writeFileSync(this.stateFile, JSON.stringify(dataObj, null, 2), "utf8");
  }
}

export default WalletService;

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.097021Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.958937Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.105034Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.541300Z
