# QMOI Enhanced API Testing Suite
# Run with: npm test or npx jest --config=jest.config.js

import request from 'supertest';

// Mock authentication for testing
const mockAuthToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItMTIzIiwicm9sZSI6ImFkbWluIn0.signed';
const mockUserToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLWFiYyIsInJvbGUiOiJ1c2VyIn0.signed';

describe('QMOI Enhanced API Tests', () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  describe('Authentication Endpoints', () => {
    it('POST /api/auth/register - Should register a new user', async () => {
      const response = await request(baseUrl)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123!',
          name: 'Test User'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('POST /api/auth/login - Should authenticate user', async () => {
      const response = await request(baseUrl)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123!'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('POST /api/auth/logout - Should logout user', async () => {
      const response = await request(baseUrl)
        .post('/api/auth/logout')
        .set('Authorization', mockUserToken);

      expect(response.status).toBe(200);
    });
  });

  describe('Admin Endpoints', () => {
    it('GET /api/admin/users - Should list all users (admin only)', async () => {
      const response = await request(baseUrl)
        .get('/api/admin/users')
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
    });

    it('GET /api/admin/dashboard - Should return dashboard stats', async () => {
      const response = await request(baseUrl)
        .get('/api/admin/dashboard')
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalUsers');
      expect(response.body).toHaveProperty('totalRevenue');
    });

    it('GET /api/admin/audit-logs - Should retrieve audit logs', async () => {
      const response = await request(baseUrl)
        .get('/api/admin/audit-logs')
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('GET /api/admin/alerts - Should get system alerts', async () => {
      const response = await request(baseUrl)
        .get('/api/admin/alerts')
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('alerts');
    });
  });

  describe('User Endpoints', () => {
    it('GET /api/users/profile - Should return user profile', async () => {
      const response = await request(baseUrl)
        .get('/api/users/profile')
        .set('Authorization', mockUserToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
    });

    it('PUT /api/users/profile - Should update user profile', async () => {
      const response = await request(baseUrl)
        .put('/api/users/profile')
        .set('Authorization', mockUserToken)
        .send({
          name: 'Updated Name',
          phone: '+1-234-567-8900'
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Name');
    });
  });

  describe('Analytics Endpoints', () => {
    it('GET /api/analytics/wallets - Should return wallet analytics', async () => {
      const response = await request(baseUrl)
        .get('/api/analytics/wallets')
        .set('Authorization', mockUserToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalBalance');
      expect(response.body).toHaveProperty('wallets');
    });

    it('GET /api/analytics/transactions - Should return transaction analytics', async () => {
      const response = await request(baseUrl)
        .get('/api/analytics/transactions')
        .set('Authorization', mockUserToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('transactions');
    });
  });

  describe('Biometric Endpoints', () => {
    it('POST /api/biometric/register - Should register biometric', async () => {
      const response = await request(baseUrl)
        .post('/api/biometric/register')
        .set('Authorization', mockUserToken)
        .send({
          biometricType: 'fingerprint',
          biometricData: 'base64-encoded-fingerprint-data'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('biometricId');
    });

    it('POST /api/biometric/verify - Should verify biometric', async () => {
      const response = await request(baseUrl)
        .post('/api/biometric/verify')
        .send({
          biometricType: 'fingerprint',
          biometricData: 'base64-encoded-fingerprint-data'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('verified');
    });
  });

  describe('Payment Endpoints', () => {
    it('POST /api/payments/initiate - Should initiate payment', async () => {
      const response = await request(baseUrl)
        .post('/api/payments/initiate')
        .set('Authorization', mockUserToken)
        .send({
          amount: 99.99,
          currency: 'USD',
          provider: 'stripe',
          description: 'Test payment'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('redirectUrl');
      expect(response.body).toHaveProperty('transactionId');
    });
  });

  describe('Error Handling', () => {
    it('Should return 401 for unauthorized requests', async () => {
      const response = await request(baseUrl)
        .get('/api/admin/users');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('Should return 403 for insufficient permissions', async () => {
      const response = await request(baseUrl)
        .get('/api/admin/users')
        .set('Authorization', mockUserToken);

      expect(response.status).toBe(403);
    });

    it('Should return 404 for non-existent endpoints', async () => {
      const response = await request(baseUrl)
        .get('/api/nonexistent');

      expect(response.status).toBe(404);
    });
  });

  describe('Rate Limiting', () => {
    it('Should enforce rate limits', async () => {
      const promises = [];
      for (let i = 0; i < 150; i++) {
        promises.push(
          request(baseUrl)
            .get('/api/users/profile')
            .set('Authorization', mockUserToken)
        );
      }

      const responses = await Promise.all(promises);
      const rateLimited = responses.some(r => r.status === 429);
      expect(rateLimited).toBe(true);
    });
  });
});
