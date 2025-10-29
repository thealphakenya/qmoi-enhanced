import { WalletService, MockAdapter, TestnetAdapter } from '../src/wallet';

describe('WalletService basic flows (mock-first)', () => {
  test('registers adapters and returns balances', async () => {
    const svc = new WalletService('.qmoi_state_test');
    const m = new MockAdapter('mock1');
    svc.registerAdapter(m);
    const t = new TestnetAdapter('binance_testnet', { apiKey: null });
    svc.registerAdapter(t);

    const balances = await svc.getAllBalances();
    expect(balances).toHaveProperty('mock1');
    expect(balances.mock1.native.amount).toBe(100.0);
    expect(balances).toHaveProperty('binance_testnet');
  });
});
