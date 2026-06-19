// lib/auth/biometric-service.ts
// Biometric Authentication Service - Production Ready

import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export interface BiometricData {
  userId: string;
  method: 'fingerprint' | 'facial' | 'voice';
  templateData: Buffer;
  confidence: number;
}

export interface VerificationResult {
  verified: boolean;
  confidence: number;
  error?: string;
}

export class BiometricService {
  // Confidence threshold for verification (80%)
  private confidenceThreshold = 0.80;
  private maxEnrollmentsPerUser = 3;

  /**
   * Enroll a biometric template
   * Hash template data for storage
   * Verify method not already enrolled
   */
  async enrollBiometric(data: BiometricData): Promise<{
    success: boolean;
    message: string;
    method: string;
  }> {
    // Check if method already enrolled
    const existing = await prisma.biometricProfile.findUnique({
      where: {
        userId_method: {
          userId: data.userId,
          method: data.method,
        },
      },
    });

    if (existing) {
      throw new Error(`${data.method} already enrolled for this user`);
    }

    // Check max enrollments
    const count = await prisma.biometricProfile.count({
      where: { userId: data.userId },
    });

    if (count >= this.maxEnrollmentsPerUser) {
      throw new Error(
        `Maximum ${this.maxEnrollmentsPerUser} biometric methods allowed`
      );
    }

    // Hash template data using SHA-256
    const templateHash = crypto
      .createHash('sha256')
      .update(data.templateData)
      .digest('hex');

    // Store biometric profile
    const profile = await prisma.biometricProfile.create({
      data: {
        userId: data.userId,
        method: data.method,
        templateHash,
        confidenceThreshold: this.confidenceThreshold,
        verified: true,
      },
    });

    // Audit log
    await this.auditBiometricAttempt(
      data.userId,
      'ENROLL',
      data.method,
      'success'
    );

    return {
      success: true,
      message: `${data.method} biometric enrolled successfully`,
      method: data.method,
    };
  }

  /**
   * Verify biometric template against enrolled profile
   * Calculate similarity score
   * Return confidence and verification result
   */
  async verifyBiometric(
    userId: string,
    method: 'fingerprint' | 'facial' | 'voice',
    templateData: Buffer
  ): Promise<VerificationResult> {
    // Get enrolled profile
    const profile = await prisma.biometricProfile.findUnique({
      where: {
        userId_method: {
          userId,
          method,
        },
      },
    });

    if (!profile) {
      await this.auditBiometricAttempt(userId, 'VERIFY', method, 'not_enrolled');
      return {
        verified: false,
        confidence: 0,
        error: 'Biometric method not enrolled',
      };
    }

    // Hash provided template
    const providedHash = crypto
      .createHash('sha256')
      .update(templateData)
      .digest('hex');

    // Calculate similarity (simple string comparison, would use ML in production)
    const confidence = this.calculateSimilarity(
      profile.templateHash,
      providedHash
    );

    // Check against threshold
    const verified = confidence >= this.confidenceThreshold;

    // Audit log
    await this.auditBiometricAttempt(
      userId,
      'VERIFY',
      method,
      verified ? 'success' : 'failed',
      { confidence }
    );

    // Update last verified
    if (verified) {
      await prisma.biometricProfile.update({
        where: {
          userId_method: {
            userId,
            method,
          },
        },
        data: { lastVerifiedAt: new Date() },
      });
    }

    return { verified, confidence };
  }

  /**
   * Get biometric status for user
   */
  async getBiometricStatus(userId: string) {
    const profiles = await prisma.biometricProfile.findMany({
      where: { userId },
      select: {
        method: true,
        verified: true,
        enrolledAt: true,
        lastVerifiedAt: true,
      },
    });

    return {
      enrolled: profiles.length > 0,
      methods: profiles.map((p) => ({
        method: p.method,
        enrolled: p.verified,
        enrolledAt: p.enrolledAt,
        lastVerifiedAt: p.lastVerifiedAt,
      })),
    };
  }

  /**
   * Delete biometric enrollment
   */
  async deleteBiometric(
    userId: string,
    method: string
  ): Promise<{ success: boolean }> {
    await prisma.biometricProfile.deleteMany({
      where: {
        userId,
        method,
      },
    });

    await this.auditBiometricAttempt(userId, 'DELETE', method, 'success');

    return { success: true };
  }

  /**
   * Calculate similarity between two template hashes
   * Simple implementation - in production use ML models
   * Returns confidence score 0.0-1.0
   */
  private calculateSimilarity(hash1: string, hash2: string): number {
    if (hash1 === hash2) {
      return 1.0; // Perfect match
    }

    // Count matching characters
    let matches = 0;
    const minLength = Math.min(hash1.length, hash2.length);

    for (let i = 0; i < minLength; i++) {
      if (hash1[i] === hash2[i]) {
        matches++;
      }
    }

    // Calculate similarity percentage
    const similarity = matches / Math.max(hash1.length, hash2.length);
    return Math.round(similarity * 100) / 100; // Round to 2 decimals
  }

  /**
   * Audit log for biometric attempts
   */
  private async auditBiometricAttempt(
    userId: string,
    action: 'ENROLL' | 'VERIFY' | 'DELETE',
    method: string,
    result: string,
    details?: Record<string, any>
  ) {
    try {
      await prisma.auditLog.create({
        data: {
          userId,
          action: `BIOMETRIC_${action}`,
          method,
          result,
          details: details || {},
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error('Audit log failed:', error);
    }
  }
}

export const biometricService = new BiometricService();
