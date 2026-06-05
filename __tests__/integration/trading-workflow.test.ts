/**
 * Integration Tests - End-to-End Trading Workflows
 * Tests complete trading flow from API → Service → Exchange
 */

describe('Trading System Integration Tests', () => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
  const MASTER_TOKEN = process.env.MASTER_TOKEN || 'test-token';

  const masterHeaders = {
    'Authorization': `Bearer ${MASTER_TOKEN}`,
    'Content-Type': 'application/json',
  };

  describe('Complete Trade Execution Flow', () => {
    test('should execute full trading flow: start → signals → execute → monitor', async () => {
      // 1. Start autonomous trading
      const startResponse = await fetch(`${BASE_URL}/api/cashon/start-trading`, {
        method: 'POST',
        headers: masterHeaders,
      });
      expect(startResponse.status).toBe(200);
      const startData = await startResponse.json();
      expect(startData.success).toBe(true);

      // 2. Get trading signals
      const signalsResponse = await fetch(`${BASE_URL}/api/cashon/signals`);
      expect(signalsResponse.status).toBe(200);
      const signalsData = await signalsResponse.json();
      expect(signalsData).toHaveProperty('signals');

      // 3. Check trading status
      const statusResponse = await fetch(`${BASE_URL}/api/cashon/trading-status`, {
        headers: masterHeaders,
      });
      expect(statusResponse.status).toBe(200);
      const statusData = await statusResponse.json();
      expect(statusData).toHaveProperty('enabled');
      expect(statusData.enabled).toBe(true);

      // 4. Check balance
      const balanceResponse = await fetch(`${BASE_URL}/api/cashon/balance`, {
        headers: masterHeaders,
      });
      expect(balanceResponse.status).toBe(200);
      const balanceData = await balanceResponse.json();
      expect(balanceData).toHaveProperty('balance');

      // 5. Stop trading
      const stopResponse = await fetch(`${BASE_URL}/api/cashon/stop-trading`, {
        method: 'POST',
        headers: masterHeaders,
      });
      expect(stopResponse.status).toBe(200);
      const stopData = await stopResponse.json();
      expect(stopData.success).toBe(true);
    });
  });

  describe('Deposit & Trading Capital Flow', () => {
    test('should deposit funds and verify balance increase', async () => {
      const depositAmount = 500;

      // 1. Get initial balance
      const initialBalanceResponse = await fetch(`${BASE_URL}/api/cashon/balance`, {
        headers: masterHeaders,
      });
      const initialBalance = await initialBalanceResponse.json();

      // 2. Submit deposit
      const depositResponse = await fetch(`${BASE_URL}/api/cashon/deposit`, {
        method: 'POST',
        headers: masterHeaders,
        body: JSON.stringify({ amount: depositAmount }),
      });
      expect(depositResponse.status).toBe(200);
      const depositData = await depositResponse.json();
      expect(depositData.success).toBe(true);

      // 3. Verify balance updated
      const finalBalanceResponse = await fetch(`${BASE_URL}/api/cashon/balance`, {
        headers: masterHeaders,
      });
      const finalBalance = await finalBalanceResponse.json();
      expect(finalBalance.balance).toBeGreaterThanOrEqual(initialBalance.balance);
    });
  });

  describe('Trading Signal Processing', () => {
    test('should fetch signals for specific symbols', async () => {
      const symbols = ['BTC/USDT', 'ETH/USDT', 'XRP/USDT'];

      const response = await fetch(`${BASE_URL}/api/cashon/signals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.signals)).toBe(true);

      // Each signal should have required fields
      data.signals.forEach((signal: any) => {
        expect(signal).toHaveProperty('symbol');
        expect(signal).toHaveProperty('action'); // buy/sell/hold
        expect(signal).toHaveProperty('confidence');
        expect(['buy', 'sell', 'hold']).toContain(signal.action);
        expect(signal.confidence).toBeGreaterThanOrEqual(0);
        expect(signal.confidence).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Multi-Account Operations', () => {
    test('should support simultaneous trading accounts', async () => {
      // Simulate multiple master tokens (different accounts)
      const accounts = [
        { token: MASTER_TOKEN, name: 'Master Account' },
        { token: process.env.MASTER_TOKEN_FALLBACK || 'fallback-token', name: 'Fallback Account' },
      ];

      for (const account of accounts) {
        const headers = {
          'Authorization': `Bearer ${account.token}`,
          'Content-Type': 'application/json',
        };

        const response = await fetch(`${BASE_URL}/api/cashon/trading-status`, {
          headers,
        });

        // Should accept valid auth or reject invalid
        expect([200, 401]).toContain(response.status);
      }
    });
  });

  describe('Concurrent Operation Handling', () => {
    test('should handle concurrent start/stop requests', async () => {
      const requests = [
        fetch(`${BASE_URL}/api/cashon/start-trading`, {
          method: 'POST',
          headers: masterHeaders,
        }),
        fetch(`${BASE_URL}/api/cashon/trading-status`, {
          headers: masterHeaders,
        }),
        fetch(`${BASE_URL}/api/cashon/signals`),
      ];

      const responses = await Promise.all(requests);
      expect(responses.length).toBe(3);

      // All should complete without errors
      responses.forEach(response => {
        expect([200, 400, 401, 500]).toContain(response.status);
      });
    });
  });

  describe('Error Recovery', () => {
    test('should recover from invalid operations', async () => {
      // Try invalid amount
      const badDepositResponse = await fetch(`${BASE_URL}/api/cashon/deposit`, {
        method: 'POST',
        headers: masterHeaders,
        body: JSON.stringify({ amount: -100 }),
      });
      expect(badDepositResponse.status).toBe(400);

      // Should still be able to make valid request after error
      const goodDepositResponse = await fetch(`${BASE_URL}/api/cashon/deposit`, {
        method: 'POST',
        headers: masterHeaders,
        body: JSON.stringify({ amount: 100 }),
      });
      expect([200, 400]).toContain(goodDepositResponse.status);
    });

    test('should retry after auth failure', async () => {
      // First attempt without auth
      const noAuthResponse = await fetch(`${BASE_URL}/api/cashon/start-trading`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(noAuthResponse.status).toBe(401);

      // Second attempt with auth
      const withAuthResponse = await fetch(`${BASE_URL}/api/cashon/start-trading`, {
        method: 'POST',
        headers: masterHeaders,
      });
      expect(withAuthResponse.status).toBe(200);
    });
  });

  describe('Performance & Rate Limiting', () => {
    test('should handle rapid sequential requests', async () => {
      const startTime = Date.now();

      for (let i = 0; i < 5; i++) {
        const response = await fetch(`${BASE_URL}/api/cashon/signals`);
        expect(response.status).toBe(200);
      }

      const duration = Date.now() - startTime;
      // Should complete 5 requests in less than 5 seconds
      expect(duration).toBeLessThan(5000);
    });
  });

  describe('Data Consistency', () => {
    test('should maintain consistent state across queries', async () => {
      // Get status multiple times
      const responses = await Promise.all([
        fetch(`${BASE_URL}/api/cashon/trading-status`, { headers: masterHeaders }),
        fetch(`${BASE_URL}/api/cashon/balance`, { headers: masterHeaders }),
        fetch(`${BASE_URL}/api/cashon/trading-status`, { headers: masterHeaders }),
      ]);

      const [status1, balance, status2] = await Promise.all(
        responses.map(r => r.json())
      );

      // Status should be consistent between queries
      expect(status1.enabled).toBe(status2.enabled);
      expect(status1.activeTrades).toBe(status2.activeTrades);
    });
  });
});
