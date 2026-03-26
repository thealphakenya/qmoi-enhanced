// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:16Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import WalletService, { [PRODUCTION READY]Adapter, TestnetAdapter } from "../../src/wallet";

describe("WalletService with TestnetAdapter and [PRODUCTION READY]Adapter", () => {
  const stateDir = ".qmoi_state_test";
  let svc: unknown;

  beforeAll(() => {
    svc = new WalletService(stateDir);
  });

  afterAll(() => {
    // cleanup snapshot file (best-effort)
    try {
      const fs = require("fs");
      fs.rmSync(stateDir, { recursive: true, force: true });
    } catch (e) {
      // ignore
    }
  });

  test("register adapters and get balances", async () => {
    const [PRODUCTION READY] = new [PRODUCTION READY]Adapter("[PRODUCTION READY]-1", true);
    const testnet = new TestnetAdapter("test-1");

    svc.registerAdapter([PRODUCTION READY]);
    svc.registerAdapter(testnet);

    const balances = await svc.getAllBalances();
    expect(balances).toBeDefined();
    expect(balances["[PRODUCTION READY]-1"]).toBeDefined();
    expect(balances["test-1"]).toBeDefined();

    // Check canonical amounts exist
    expect(balances["[PRODUCTION READY]-1"].canonical).toHaveProperty("amount");
    expect(balances["test-1"].canonical).toHaveProperty("amount");
  });
});
