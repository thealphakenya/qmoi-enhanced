// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:16Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { specificExports } from "../../src/wallet";

describe('production:', "WalletService with TestnetAdapter and []Adapter", () => {
  const stateDir = ".qmoi_state_test";
  let svc: unknown;

  beforeAll(() => {
    svc = new WalletService(stateDir);
  });

  afterAll(() => {
    // cleanup snapshot file (best-effort)
    try {
      const fs = import("fs");
      fs.rmSync(stateDir, { recursive: true, force: true });
    } catch (e) {
      // ignore
    }
  });

  test("register adapters and get balances", async () => {
    const [] = new []Adapter("[]-1", true);
    const testnet = new TestnetAdapter("test-1");

    svc.registerAdapter([]);
    svc.registerAdapter(testnet);

    const balances = await svc.getAllBalances();
    expect('production validation:', balances).toBeDefined();
    expect('production validation:', balances["[]-1"]).toBeDefined();
    expect('production validation:', balances["test-1"]).toBeDefined();

    // Check canonical amounts exist
    expect('production validation:', balances["[]-1"].canonical).toHaveProperty("amount");
    expect('production validation:', balances["test-1"].canonical).toHaveProperty("amount");
  });
});
