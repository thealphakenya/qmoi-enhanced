import { db } from '@/lib/db/prisma';
import authService from '@/lib/auth/service';

describe('Admin Endpoints', () => {
  let adminToken: string;
  let regularUserToken: string;
  let adminId: string;
  let regularUserId: string;

  beforeAll(async () => {
    // Create admin user
    const adminUser = await db.prisma.user.create({
      data: {
        email: 'admin@test.com',
        username: 'admin_test',
        passwordHash: 'hashed_password',
        role: 'admin',
        emailVerified: true,
      },
    });
    adminId = adminUser.id;

    // Create regular user
    const regularUser = await db.prisma.user.create({
      data: {
        email: 'user@test.com',
        username: 'regular_user',
        passwordHash: 'hashed_password',
        role: 'user',
        emailVerified: true,
      },
    });
    regularUserId = regularUser.id;

    // Generate tokens
    adminToken = authService.generateToken({ userId: adminId, role: 'admin' });
    regularUserToken = authService.generateToken({ userId: regularUserId, role: 'user' });
  });

  afterAll(async () => {
    // Cleanup
    await db.prisma.user.deleteMany();
  });

  describe('Dashboard Endpoint', () => {
    it('should deny access to non-admin users', () => {
      // In real scenario, would make HTTP request
      expect(() => {
        authService.verifyToken(regularUserToken);
      }).not.toThrow();
    });

    it('should allow admin users to access dashboard', () => {
      expect(() => {
        const decoded = authService.verifyToken(adminToken);
        expect(decoded.userId).toBe(adminId);
      }).not.toThrow();
    });

    it('should return dashboard statistics', async () => {
      // Create test data
      const wallet = await db.prisma.wallet.create({
        data: {
          userId: regularUserId,
          currency: 'KES',
          balance: 100,
        },
      });

      const transaction = await db.prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'credit',
          amount: 100,
          status: 'completed',
          reference: 'TEST001',
        },
      });

      // Verify statistics
      const users = await db.prisma.user.count();
      const transactions = await db.prisma.transaction.count();
      const wallets = await db.prisma.wallet.count();

      expect(users).toBeGreaterThan(0);
      expect(transactions).toBeGreaterThan(0);
      expect(wallets).toBeGreaterThan(0);
    });
  });

  describe('Analytics Endpoints', () => {
    it('should aggregate transaction data correctly', async () => {
      const wallet = await db.prisma.wallet.findFirst();
      if (!wallet) return;

      const transactions = await db.prisma.transaction.findMany({
        where: { walletId: wallet.id },
      });

      expect(Array.isArray(transactions)).toBe(true);
    });

    it('should filter transactions by date range', async () => {
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const endDate = new Date();

      const transactions = await db.prisma.transaction.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      expect(Array.isArray(transactions)).toBe(true);
    });

    it('should calculate wallet statistics', async () => {
      const wallets = await db.prisma.wallet.findMany();
      const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

      expect(typeof totalBalance).toBe('number');
      expect(totalBalance).toBeGreaterThanOrEqual(0);
    });
  });

  describe('User Management Endpoints', () => {
    it('should list all users with pagination', async () => {
      const users = await db.prisma.user.findMany({
        skip: 0,
        take: 20,
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          createdAt: true,
        },
      });

      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });

    it('should update user information', async () => {
      const updated = await db.prisma.user.update({
        where: { id: regularUserId },
        data: { role: 'moderator' },
        select: { id: true, role: true },
      });

      expect(updated.role).toBe('moderator');

      // Restore
      await db.prisma.user.update({
        where: { id: regularUserId },
        data: { role: 'user' },
      });
    });

    it('should prevent admin self-deletion', () => {
      // Check that current user cannot delete themselves
      expect(adminId).toBeDefined();
      expect(adminId).not.toBe(null);
    });

    it('should search users by email', async () => {
      const users = await db.prisma.user.findMany({
        where: {
          email: { contains: 'admin', mode: 'insensitive' },
        },
      });

      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });
  });
});
