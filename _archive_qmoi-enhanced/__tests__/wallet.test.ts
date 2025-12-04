import WalletService, { MockAdapter, TestnetAdapter } from '../../src/wallet';

describe('WalletService with TestnetAdapter and MockAdapter', () => {
  const stateDir = '.qmoi_state_test';
  let svc: any;

  beforeAll(() => {
    svc = new WalletService(stateDir);
  });

  afterAll(() => {
    // cleanup snapshot file (best-effort)
    try {
      const fs = require('fs');
      fs.rmSync(stateDir, { recursive: true, force: true });
    } catch (e) {
      // ignore
    }
  });

  test('register adapters and get balances', async () => {
    const mock = new MockAdapter('mock-1', true);
    const testnet = new TestnetAdapter('test-1');

    svc.registerAdapter(mock);
    svc.registerAdapter(testnet);

    const balances = await svc.getAllBalances();
    expect(balances).toBeDefined();
    expect(balances['mock-1']).toBeDefined();
    expect(balances['test-1']).toBeDefined();

    // Check canonical amounts exist
    expect(balances['mock-1'].canonical).toHaveProperty('amount');
    expect(balances['test-1'].canonical).toHaveProperty('amount');
  });
});
