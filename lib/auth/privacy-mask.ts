// lib/auth/privacy-mask.ts
// Privacy Mask Service - Anonymize user data in logs

import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export type PrivacyLevel = 'basic' | 'full';

export class PrivacyMaskService {
  /**
   * Enable privacy mask for a user session
   * Level: basic (hide name/email) or full (anonymize all)
   */
  async enablePrivacyMask(
    userId: string,
    level: PrivacyLevel = 'basic'
  ): Promise<{
    success: boolean;
    level: PrivacyLevel;
    token: string;
    message: string;
  }> {
    // Generate privacy mask token
    const token = crypto.randomBytes(16).toString('hex');

    // Update session with privacy mask
    await prisma.userSession.updateMany({
      where: { userId, isActive: true },
      data: {
        privacyMaskEnabled: true,
        privacyMaskLevel: level,
        privacyMaskToken: token,
      },
    });

    // Audit log
    await this.auditPrivacyMask(userId, 'ENABLE', level);

    return {
      success: true,
      level,
      token,
      message: `Privacy mask enabled - ${level} level`,
    };
  }

  /**
   * Disable privacy mask for user
   */
  async disablePrivacyMask(userId: string): Promise<{ success: boolean }> {
    await prisma.userSession.updateMany({
      where: { userId, isActive: true },
      data: {
        privacyMaskEnabled: false,
        privacyMaskLevel: 'none',
        privacyMaskToken: null,
      },
    });

    await this.auditPrivacyMask(userId, 'DISABLE', 'none');

    return { success: true };
  }

  /**
   * Get privacy mask status for user
   */
  async getPrivacyMaskStatus(userId: string): Promise<{
    enabled: boolean;
    level: PrivacyLevel | 'none';
    message: string;
  }> {
    const session = await prisma.userSession.findFirst({
      where: { userId, isActive: true },
      select: { privacyMaskEnabled: true, privacyMaskLevel: true },
    });

    if (!session) {
      return { enabled: false, level: 'none', message: 'No active session' };
    }

    const enabled = session.privacyMaskEnabled || false;
    const level = (session.privacyMaskLevel || 'none') as PrivacyLevel | 'none';

    return {
      enabled,
      level,
      message: enabled
        ? `Privacy mask active - ${level} level`
        : 'Privacy mask not active',
    };
  }

  /**
   * Anonymize data based on privacy level
   * basic: Hide name and email
   * full: Hide all PII (show as [Anonymous])
   */
  anonymizeData(data: Record<string, any>, level: PrivacyLevel): Record<string, any> {
    if (level === 'basic') {
      return {
        ...data,
        name: '[Masked]',
        email: '[Masked]',
      };
    } else if (level === 'full') {
      // Full anonymization - replace all PII
      const anonymized: Record<string, any> = {};
      for (const key in data) {
        if (
          ['name', 'email', 'phone', 'address', 'ssn', 'userId'].includes(
            key.toLowerCase()
          )
        ) {
          anonymized[key] = '[Anonymous]';
        } else {
          anonymized[key] = data[key];
        }
      }
      return anonymized;
    }

    return data;
  }

  /**
   * Check if user has privacy mask enabled
   */
  async isPrivacyMaskEnabled(userId: string): Promise<{
    enabled: boolean;
    level: PrivacyLevel | 'none';
  }> {
    const session = await prisma.userSession.findFirst({
      where: { userId, isActive: true },
    });

    return {
      enabled: session?.privacyMaskEnabled || false,
      level: (session?.privacyMaskLevel as PrivacyLevel) || 'none',
    };
  }

  /**
   * Audit log for privacy mask operations
   */
  private async auditPrivacyMask(
    userId: string,
    action: 'ENABLE' | 'DISABLE',
    level: PrivacyLevel | 'none'
  ) {
    try {
      await prisma.auditLog.create({
        data: {
          userId,
          action: `PRIVACY_MASK_${action}`,
          result: level,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error('Audit log failed:', error);
    }
  }
}

export const privacyMaskService = new PrivacyMaskService();
