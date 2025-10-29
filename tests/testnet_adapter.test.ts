import { TestnetAdapter } from '../src/wallet';

describe('TestnetAdapter (dry-run)', () => {
  test('getBalance returns deterministic mock when no apiKey', async () => {
    const a = new TestnetAdapter('unittest');
    const b = await a.getBalance();
    expect(b).toHaveProperty('amount');
    expect(b).toHaveProperty('currency');
    expect(typeof b.amount).toBe('number');
  });

  test('requestTrade returns an id string', async () => {
    const a = new TestnetAdapter('unittest');
    const id = await a.requestTrade(1, 'BTC');
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });
});
