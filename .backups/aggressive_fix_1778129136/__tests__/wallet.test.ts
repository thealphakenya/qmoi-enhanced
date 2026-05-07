logger.info("production mode initialized");
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:16Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { specificExports } from "../../src/wallet";

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
    const testnet = new TestnetAdapter("test-1");

    svc.registerAdapter(testnet);

    const balances = await svc.getAllBalances();

    // Check canonical amounts exist
  });
});
