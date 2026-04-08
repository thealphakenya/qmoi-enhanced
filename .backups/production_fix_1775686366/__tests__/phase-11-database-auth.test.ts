/**
 * Tests for Database Authentication (Phase 11)
 */

import { authService } from '@/lib/database-auth';
import { validateAuthToken, requireAuth, canAccessFeature } from '@/lib/auth-middleware';

describe('Database Authentication Service', () => {
  beforeEach(() => {
    // Reset before each test
    const stats = authService.getStats();
    expect(stats).toBeDefined();
  });

  it('should register a new user', async () => {
    const user = await authService.register(
      'testuser',
      'test@example.com',
      'testpassword',
    );
    expect(user.id).toBeDefined();
    expect(user.username).toBe('testuser');
    expect(user.email).toBe('test@example.com');
  });

  it('should prevent duplicate email registration', async () => {
    await authService.register('user1', 'user1@example.com', 'password');
    expect(async () => {
      await authService.register('user2', 'user1@example.com', 'password');
    }).rejects.toThrow('Email already registered');
  });

  it('should login with correct credentials', async () => {
    await authService.register('loginuser', 'login@example.com', 'password123');
    const token = await authService.login('login@example.com', 'password123');
    expect(token).toHaveProperty('token');
    expect(token).toHaveProperty('expiresIn');
    expect(token).toHaveProperty('refreshToken');
  });

  it('should reject login with incorrect password', async () => {
    await authService.register('user', 'user@example.com', 'correct');
    expect(async () => {
      await authService.login('user@example.com', 'incorrect');
    }).rejects.toThrow('Invalid credentials');
  });

  it('should validate tokens', async () => {
    const user = await authService.register('validate', 'validate@example.com', 'pass');
    const { token } = await authService.login('validate@example.com', 'pass');
    const validation = await authService.validateToken(token);
    expect(validation.valid).toBe(true);
    expect(validation.userId).toBeDefined();
  });

  it('should reject invalid tokens', async () => {
    const validation = await authService.validateToken('invalid_token');
    expect(validation.valid).toBe(false);
  });

  it('should logout user', async () => {
    await authService.register('logoutuser', 'logout@example.com', 'pass');
    const { token } = await authService.login('logout@example.com', 'pass');
    const result = await authService.logout(token);
    expect(result).toBe(true);
    const validation = await authService.validateToken(token);
    expect(validation.valid).toBe(false);
  });

  it('should refresh token', async () => {
    await authService.register('refresh', 'refresh@example.com', 'pass');
    const { token } = await authService.login('refresh@example.com', 'pass');
    const newToken = await authService.refreshToken(token);
    expect(newToken).toHaveProperty('token');
    expect(newToken.token).not.toBe(token);
  });

  it('should get user by ID', async () => {
    const registered = await authService.register('getuser', 'get@example.com', 'pass');
    const user = await authService.getUser(registered.id);
    expect(user).toBeDefined();
    expect(user?.email).toBe('get@example.com');
  });

  it('should update user profile', async () => {
    const registered = await authService.register('profileuser', 'profile@example.com', 'pass');
    const updated = await authService.updateUserProfile(registered.id, {
      username: 'newusername',
    });
    expect(updated.username).toBe('newusername');
  });

  it('should get user sessions', async () => {
    const registered = await authService.register('sessions', 'sessions@example.com', 'pass');
    await authService.login('sessions@example.com', 'pass');
    const sessions = await authService.getUserSessions(registered.id);
    expect(Array.isArray(sessions)).toBe(true);
    expect(sessions.length).toBeGreaterThan(0);
  });

  it('should revoke all sessions', async () => {
    const registered = await authService.register('revoke', 'revoke@example.com', 'pass');
    await authService.login('revoke@example.com', 'pass');
    const revoked = await authService.revokeAllSessions(registered.id);
    expect(revoked).toBeGreaterThan(0);
  });

  it('should provide authentication statistics', () => {
    const stats = authService.getStats();
    expect(stats).toHaveProperty('totalUsers');
    expect(stats).toHaveProperty('activeSessions');
    expect(stats).toHaveProperty('totalSessions');
  });
});

describe('Authentication Middleware', () => {
  it('should detect missing authorization header', async () => {
    const mockRequest = new Request('http://localhost/api/test', {
      headers: {},
    });
    const auth = await validateAuthToken(mockRequest as any);
    expect(auth.isAuthenticated).toBe(false);
  });

  it('should support feature access checking', async () => {
    const authContext = {
      userId: 'user123',
      token: 'token123',
      isAuthenticated: true,
      isAdmin: false,
      metadata: { permissions: ['read:own_data'] },
    };
    expect(canAccessFeature(authContext, 'read:own_data')).toBe(true);
    expect(canAccessFeature(authContext, 'write:all_data')).toBe(false);
  });

  it('should allow admins all access', () => {
    const adminContext = {
      userId: 'admin123',
      token: 'token123',
      isAuthenticated: true,
      isAdmin: true,
      metadata: { permissions: [] },
    };
    expect(canAccessFeature(adminContext, 'anything')).toBe(true);
  });
});
