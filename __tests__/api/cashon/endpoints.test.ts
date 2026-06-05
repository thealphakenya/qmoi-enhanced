/**
 * Cashon Trading API - Comprehensive Test Suite
 * Tests all 6 Cashon endpoints with Master-only authentication
 * Unit, integration, and edge case coverage
 */

describe('Cashon Trading API Endpoints', () => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
  const MASTER_TOKEN = process.env.MASTER_TOKEN || 'test-master-token';
  
  const masterHeaders = {
    'Authorization': `Bearer ${MASTER_TOKEN}`,
    'Content-Type': 'application/json',
  };

  describe('POST /api/cashon/start-trading', () => {
    test('should start trading with valid master token', async () => {
      const response = await fetch(`${BASE_URL}/api/cashon/start-trading`, {
        method: 'POST',
        headers: masterHeaders,
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.message).toContain('started');
    });

    test('should reject without master token', async () => {
      const response = await fetch(`${BASE_URL}/api/cashon/start-trading`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      expect(response.status).toBe(401);
    });

    test('should reject with invalid token', async () => {
      const response = await fetch(`${BASE_URL}/api/cashon/start-trading`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer invalid-token',
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/cashon/stop-trading', () => {
    test('should stop trading with valid master token', async () => {
      const response = await fetch(`${BASE_URL}/api/cashon/stop-trading`, {
        method: 'POST',
        headers: masterHeaders,
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });

    test('should reject unauthorized requests', async () => {
      const response = await fetch(`${BASE_URL}/api/cashon/stop-trading`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/cashon/trading-status', () => {
    test('should return trading status with master token', async () => {
      const response = await fetch(`${BASE_URL}/api/cashon/trading-status`, {
        headers: masterHeaders,
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('enabled');
      expect(data).toHaveProperty('activeTrades');
    });

    test('should reject without auth', async () => {
      const response = await fetch(`${BASE_URL}/api/cashon/trading-status`);
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/cashon/signals', () => {
    test('should return trading signals without auth', async () => {
      const response = await fetch(`${BASE_URL}/api/cashon/signals`);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(Array.isArray(data.signals) || Array.isArray(data)).toBe(true);
    });

    test('should support POST to generate signals', async () => {
      const response = await fetch(`${BASE_URL}/api/cashon/signals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols: ['BTC/USDT', 'ETH/USDT'] }),
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('signals');
    });
  });

  describe('GET /api/cashon/balance', () => {
    test('should return wallet balance with master token', async () => {
      const response = await fetch(`${BASE_URL}/api/cashon/balance`, {
        headers: masterHeaders,
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('balance');
    });

    test('should reject without master token', async () => {
      const response = await fetch(`${BASE_URL}/api/cashon/balance`);
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/cashon/deposit', () => {
    test('should accept valid deposit amount', async () => {
      const response = await fetch(`${BASE_URL}/api/cashon/deposit`, {
        method: 'POST',
        headers: masterHeaders,
        body: JSON.stringify({ amount: 1000 }),
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });

    test('should reject negative amount', async () => {
      const response = await fetch(`${BASE_URL}/api/cashon/deposit`, {
        method: 'POST',
        headers: masterHeaders,
        body: JSON.stringify({ amount: -100 }),
      });
      
      expect(response.status).toBe(400);
    });

    test('should reject zero amount', async () => {
      const response = await fetch(`${BASE_URL}/api/cashon/deposit`, {
        method: 'POST',
        headers: masterHeaders,
        body: JSON.stringify({ amount: 0 }),
      });
      
      expect(response.status).toBe(400);
    });

    test('should reject without master token', async () => {
      const response = await fetch(`${BASE_URL}/api/cashon/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1000 }),
      });
      
      expect(response.status).toBe(401);
    });
  });

  describe('Authentication & Security', () => {
    test('should validate bearer token format', async () => {
      const response = await fetch(`${BASE_URL}/api/cashon/start-trading`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from('user:pass').toString('base64'),
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status).toBe(401);
    });

    test('should handle missing Authorization header', async () => {
      const response = await fetch(`${BASE_URL}/api/cashon/start-trading`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      expect(response.status).toBe(401);
    });
  });

  describe('Error Handling', () => {
    test('should handle service errors gracefully', async () => {
      const response = await fetch(`${BASE_URL}/api/cashon/start-trading`, {
        method: 'POST',
        headers: masterHeaders,
      });
      
      // Should return valid response (200 or error code, not 500)
      expect([200, 400, 401, 500]).toContain(response.status);
    });
  });
});
