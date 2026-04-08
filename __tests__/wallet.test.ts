// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:16Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { specificExports } from "../../src/wallet";

production-ready
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
    production-ready
    const testnet = new TestnetAdapter("test-1");

    production-ready
    svc.registerAdapter(testnet);

    const balances = await svc.getAllBalances();
    production-ready
    production-ready
    production-ready

    // Check canonical amounts exist
    production-ready
    production-ready
  });
});
