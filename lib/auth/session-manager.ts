// lib/auth/session-manager.ts
// Session Management Service - Track devices and sessions

import { PrismaClient } from '@prisma/client';
import { UAParser } from 'ua-parser-js';
import crypto from 'crypto';

const prisma = new PrismaClient();

export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  browser: string;
  os: string;
  ipAddress: string;
}

export class SessionManager {
  /**
   * Capture device information from User-Agent and IP
   */
  captureDeviceInfo(userAgent: string, ipAddress: string): DeviceInfo {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    const deviceId = this.generateDeviceId(userAgent, ipAddress);
    const deviceType = result.device?.type || 'desktop';
    const browser = result.browser?.name || 'Unknown';
    const os = result.os?.name || 'Unknown';
    const deviceName = `${browser} on ${os}`;

    return {
      deviceId,
      deviceName,
      deviceType,
      browser,
      os,
      ipAddress,
    };
  }

  /**
   * Create or update session with device tracking
   */
  async createSession(userId: string, deviceInfo: DeviceInfo): Promise<string> {
    const sessionId = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.userSession.create({
      data: {
        id: sessionId,
        userId,
        accessToken: 'placeholder',
        refreshToken: 'placeholder',
        deviceId: deviceInfo.deviceId,
        deviceName: deviceInfo.deviceName,
        deviceType: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        ipAddress: deviceInfo.ipAddress,
        isActive: true,
        lastActivity: new Date(),
        expiresAt,
      },
    });

    return sessionId;
  }

  /**
   * Get all active sessions for user
   */
  async getUserSessions(userId: string): Promise<any[]> {
    const sessions = await prisma.userSession.findMany({
      where: { userId, isActive: true },
      select: {
        id: true,
        deviceName: true,
        deviceType: true,
        browser: true,
        os: true,
        ipAddress: true,
        lastActivity: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { lastActivity: 'desc' },
    });

    return sessions;
  }

  /**
   * Get session count per user
   */
  async getSessionCount(userId: string): Promise<number> {
    return prisma.userSession.count({
      where: { userId, isActive: true },
    });
  }

  /**
   * Terminate specific session
   */
  async terminateSession(sessionId: string, userId: string): Promise<void> {
    const session = await prisma.userSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      throw new Error('Session not found or unauthorized');
    }

    await prisma.userSession.update({
      where: { id: sessionId },
      data: { isActive: false },
    });

    await this.auditSessionAction(userId, 'TERMINATE', sessionId);
  }

  /**
   * Terminate all other sessions for user (keep current active)
   */
  async terminateAllOtherSessions(
    userId: string,
    currentSessionId: string
  ): Promise<number> {
    const result = await prisma.userSession.updateMany({
      where: {
        userId,
        id: { not: currentSessionId },
        isActive: true,
      },
      data: { isActive: false },
    });

    await this.auditSessionAction(userId, 'TERMINATE_ALL_OTHERS', '');

    return result.count;
  }

  /**
   * Rename/label a session
   */
  async renameSession(
    sessionId: string,
    userId: string,
    label: string
  ): Promise<string> {
    const session = await prisma.userSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      throw new Error('Session not found or unauthorized');
    }

    const updated = await prisma.userSession.update({
      where: { id: sessionId },
      data: {
        deviceName: `${label} (${session.browser} on ${session.os})`,
      },
      select: { deviceName: true },
    });

    await this.auditSessionAction(userId, 'RENAME', sessionId, label);

    return updated.deviceName;
  }

  /**
   * Update last activity timestamp
   */
  async updateLastActivity(sessionId: string): Promise<void> {
    await prisma.userSession.update({
      where: { id: sessionId },
      data: { lastActivity: new Date() },
    });
  }

  /**
   * Check if session is still valid
   */
  async isSessionValid(sessionId: string): Promise<boolean> {
    const session = await prisma.userSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) return false;
    if (!session.isActive) return false;
    if (new Date() > session.expiresAt) {
      await prisma.userSession.update({
        where: { id: sessionId },
        data: { isActive: false },
      });
      return false;
    }

    return true;
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    const result = await prisma.userSession.updateMany({
      where: {
        isActive: true,
        expiresAt: { lt: new Date() },
      },
      data: { isActive: false },
    });

    return result.count;
  }

  /**
   * Generate unique device ID from User-Agent and IP
   */
  private generateDeviceId(userAgent: string, ipAddress: string): string {
    const combined = `${userAgent}:${ipAddress}`;
    return require('crypto')
      .createHash('sha256')
      .update(combined)
      .digest('hex')
      .substring(0, 32);
  }

  /**
   * Audit log for session actions
   */
  private async auditSessionAction(
    userId: string,
    action: string,
    sessionId: string,
    details?: string
  ) {
    try {
      await prisma.auditLog.create({
        data: {
          userId,
          action: `SESSION_${action}`,
          result: sessionId,
          details: { sessionId, details } || {},
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error('Audit log failed:', error);
    }
  }
}

export const sessionManager = new SessionManager();
