// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:27Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'qmoi_default_access_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'qmoi_default_refresh_secret';
const SESSION_TIMEOUT = parseInt(process.env.SESSION_TIMEOUT || '3600000');
const USE_DB = Boolean(process.env.DATABASE_URL);

type FallbackUser = {
  userId: string;
  email: string;
  username: string;
  fullName: string;
  role: string;
  permissions: string[];
  password: string;
};

const fallbackUsers: FallbackUser[] = [
  {
    email: 'victor@kwemoi.com',
    username: 'master',
    fullName: 'Victor',
    role: 'master',
    permissions: ['*'],
    password: 'Victor9798!',
    userId: 'master',
  },
  {
    email: 'leah@chebet.com',
    username: 'sister',
    fullName: 'Leah',
    role: 'sister',
    permissions: ['family', 'chat'],
    password: 'Ashlehael',
    userId: 'sister',
  },
];

export const authFallback = {
  findUserByIdentifier(identifier: string): FallbackUser | undefined {
    return fallbackUsers.find((user) => user.email === identifier || user.username === identifier);
  },
  findUserByEmail(email: string): FallbackUser | undefined {
    return fallbackUsers.find((user) => user.email === email);
  },
  findUserByUsername(username: string): FallbackUser | undefined {
    return fallbackUsers.find((user) => user.username === username);
  },
  createUser(userData: Omit<FallbackUser, 'userId'>) {
    const userId = userData.username;
    const newUser: FallbackUser = { ...userData, userId };
    fallbackUsers.push(newUser);
    return newUser;
  },
  updatePassword(userId: string, newPassword: string) {
    const user = fallbackUsers.find((u) => u.userId === userId);
    if (!user) return false;
    user.password = newPassword;
    return true;
  },
};

export type DecodedToken = {
  userId: string;
  email?: string;
  role?: string;
  permissions?: string[];
  sessionId?: string;
  iat?: number;
  exp?: number;
};

export const authService = {
  generateTokens: async (
    userId: string,
    email?: string,
    role = 'user',
    permissions: string[] = [],
  ) => {
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + SESSION_TIMEOUT);
    if (USE_DB) {
      try {
        await prisma.session.create({
          data: { id: sessionId, userId, expiresAt, isActive: true } as any,
        });
      } catch (e) {
        // ignore
      }
    }

    const accessToken = jwt.sign(
      { userId, email, role, permissions, sessionId },
      JWT_SECRET,
      { expiresIn: '1h' },
    );
    const refreshToken = jwt.sign(
      { userId, sessionId, type: 'refresh' },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' },
    );
    return { accessToken, refreshToken, sessionId, expiresAt };
  },

  hashPassword: async (password: string) => {
    return bcrypt.hash(password, 12);
  },

  verifyPassword: async (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
  },

  generatePasswordResetToken: (userId: string, email: string) => {
    return jwt.sign({ userId, email, type: 'password_reset' }, JWT_SECRET, { expiresIn: '24h' });
  },

  verifyPasswordResetToken: (token: string) => {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      if (payload?.type !== 'password_reset') {
        return { ok: false, error: 'INVALID_RESET_TOKEN' };
      }
      return { ok: true, payload };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  },

  authenticatePassword: async (
    identifier: string,
    password: string
  ) => {
    if (!USE_DB) {
      const fallbackUser = authFallback.findUserByIdentifier(identifier);

      if (!fallbackUser || fallbackUser.password !== password) {
        return { success: false, message: 'Invalid credentials', error: 'INVALID_CREDENTIALS' };
      }

      const tokens = await authService.generateTokens(
        fallbackUser.userId,
        fallbackUser.email,
        fallbackUser.role,
        fallbackUser.permissions,
      );

      return {
        success: true,
        user: {
          id: fallbackUser.userId,
          email: fallbackUser.email,
          username: fallbackUser.username,
          fullName: fallbackUser.fullName,
          role: fallbackUser.role,
          permissions: fallbackUser.permissions,
        },
        tokens,
      };
    }

    // First try authProfile (newer schema)
    const profile = await prisma.authProfile.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
        ],
      },
      include: { user: true },
    });

    if (profile && profile.user && profile.isActive && profile.user.accountStatus === 'active') {
      const passwordMatches = await authService.verifyPassword(password, profile.passwordHash);
      if (!passwordMatches) {
        return { success: false, message: 'Invalid credentials', error: 'INVALID_CREDENTIALS' };
      }

      const permissions = profile.user.permissions ? JSON.parse(profile.user.permissions) : [];
      const tokens = await authService.generateTokens(profile.userId, profile.email, profile.user.role, permissions);

      await prisma.authProfile.update({
        where: { userId: profile.userId },
        data: { lastLoginAt: new Date(), lastLoginMethod: 'password' },
      });

      return {
        success: true,
        user: {
          id: profile.userId,
          email: profile.email,
          username: profile.username,
          fullName: profile.fullName,
          role: profile.user.role,
          permissions,
        },
        tokens,
      };
    }

    // Fallback: check legacy/alternate password stored on `user` record
    const legacyUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
        ],
      },
    });

    if (!legacyUser || legacyUser.accountStatus !== 'active') {
      return { success: false, message: 'Invalid credentials', error: 'INVALID_CREDENTIALS' };
    }

    const legacyHash = (legacyUser as any).passwordHash || (legacyUser as any).password || '';
    const legacyMatches = legacyHash ? await authService.verifyPassword(password, legacyHash) : false;
    if (!legacyMatches) {
      return { success: false, message: 'Invalid credentials', error: 'INVALID_CREDENTIALS' };
    }

    const permissions = legacyUser.permissions ? JSON.parse(legacyUser.permissions) : [];
    const tokens = await authService.generateTokens(legacyUser.id, legacyUser.email, legacyUser.role, permissions);

    // update last login on user
    try {
      await prisma.user.update({ where: { id: legacyUser.id }, data: { lastLogin: new Date() } });
    } catch (e) {
      // ignore
    }

    return {
      success: true,
      user: {
        id: legacyUser.id,
        email: legacyUser.email,
        username: legacyUser.username,
        fullName: `${legacyUser.firstName || ''} ${legacyUser.lastName || ''}`.trim(),
        role: legacyUser.role,
        permissions,
      },
      tokens,
    };
  },

  verifyBiometric: async (
    userId: string,
    method: 'fingerprint' | 'facial' | 'voice',
    biometricData: { confidence: number; verified: boolean; metadata?: Record<string, any> },
  ) => {
    const profile = await prisma.authProfile.findUnique({
      where: { userId },
      include: { user: true, biometricProfile: { include: { captures: true } } },
    });

    if (!profile || !profile.user || !profile.biometricProfile) {
      return { success: false, message: 'Biometric profile not found', error: 'PROFILE_NOT_FOUND' };
    }

    const captureRecords = profile.biometricProfile.captures.filter((capture) => capture.method === method && capture.verified === true);
    if (captureRecords.length < 1) {
      return { success: false, message: 'No enrolled biometric captures found', error: 'BIOMETRIC_NOT_ENROLLED' };
    }

    const verified = biometricData.confidence > 0.85;
    if (!verified) {
      return { success: false, message: 'Biometric authentication failed', error: 'INVALID_BIOMETRIC' };
    }

    // Record new biometric capture event
    await prisma.biometricCapture.create({
      data: {
        biometricProfileId: profile.biometricProfile.id,
        method,
        confidence: biometricData.confidence,
        verified: biometricData.verified,
        metadata: biometricData.metadata ? JSON.stringify(biometricData.metadata) : null,
      },
    });

    const permissions = profile.user.permissions ? JSON.parse(profile.user.permissions) : [];
    const tokens = await authService.generateTokens(profile.userId, profile.email, profile.user.role, permissions);

    await prisma.authProfile.update({
      where: { userId: profile.userId },
      data: { lastLoginAt: new Date(), lastLoginMethod: 'biometric' },
    });

    return {
      success: true,
      user: {
        id: profile.userId,
        email: profile.email,
        username: profile.username,
        fullName: profile.fullName,
        role: profile.user.role,
        permissions,
      },
      tokens,
    };
  },

  verifyJwt: (token: string) => {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      return { ok: true, payload };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  },

  verifyToken: (token: string) => {
    try {
      return jwt.verify(token, JWT_SECRET) as any;
    } catch {
      return null;
    }
  },

  validateToken: async (token: string) => {
    if (!token) return false;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const session = await prisma.session.findUnique({
        where: { id: decoded.sessionId } as any,
      });
      return !!(session && session.isActive && session.expiresAt > new Date());
    } catch (e) {
      return false;
    }
  },

  decodeToken: (token: string) => {
    try {
      const decoded = jwt.decode(token) as any;
      return decoded || null;
    } catch (e) {
      return null;
    }
  },

  invalidateSession: async (sessionId: string) => {
    try {
      await prisma.session.update({
        where: { id: sessionId } as any,
        data: { isActive: false } as any,
      });
      return true;
    } catch (e) {
      return false;
    }
  },
};

export default authService;
