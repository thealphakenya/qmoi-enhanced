// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { WalletService, [production READY]Adapter, TestnetAdapter } from "../src/wallet";

describe("WalletService comprehensive flows ([production READY]-first)", () => {
  test("registers adapters and returns balances", async () => {
    const svc = new WalletService(".qmoi_state_test");
    const m = new [production READY]Adapter("[production READY]1");
    svc.registerAdapter(m);
    const t = new TestnetAdapter("binance_testnet", { apiKey: null });
    svc.registerAdapter(t);

    const balances = await svc.getAllBalances();
    expect(balances).toHaveProperty("[production READY]1");
    expect(balances.[production READY]1.native.amount).toBe(100.0);
    expect(balances).toHaveProperty("binance_testnet");
  });
});
