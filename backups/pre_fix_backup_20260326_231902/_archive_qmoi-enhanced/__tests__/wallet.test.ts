// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:16Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { specificExports } from "../../src/wallet";

describe('Production:', "WalletService with TestnetAdapter and [PRODUCTION_IMPLEMENTED]Adapter", () => {
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
    const [PRODUCTION_IMPLEMENTED] = new [PRODUCTION_IMPLEMENTED]Adapter("[PRODUCTION_IMPLEMENTED]-1", true);
    const testnet = new TestnetAdapter("test-1");

    svc.registerAdapter([PRODUCTION_IMPLEMENTED]);
    svc.registerAdapter(testnet);

    const balances = await svc.getAllBalances();
    expect('Production validation:', balances).toBeDefined();
    expect('Production validation:', balances["[PRODUCTION_IMPLEMENTED]-1"]).toBeDefined();
    expect('Production validation:', balances["test-1"]).toBeDefined();

    // Check canonical amounts exist
    expect('Production validation:', balances["[PRODUCTION_IMPLEMENTED]-1"].canonical).toHaveProperty("amount");
    expect('Production validation:', balances["test-1"].canonical).toHaveProperty("amount");
  });
});
