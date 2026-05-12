// QMOI Biometric Authentication System
// Supports fingerprint, facial, and voice recognition with memory integration

export type BiometricMethod = 'fingerprint' | 'facial' | 'voice';

export interface BiometricCapture {
  id: string;
  method: BiometricMethod;
  verified: boolean;
  confidence: number;
  capturedAt: Date;
  expiresAt: Date;
  metadata?: {
    device?: string;
    location?: string;
    lighting?: string;
    quality?: number;
  };
}

export interface BiometricProfile {
  userId: string;
  fingerprint?: BiometricCapture;
  facial?: BiometricCapture;
  voice?: BiometricCapture;
  enrolledMethods: BiometricMethod[];
  primaryMethod: BiometricMethod;
  lastVerifiedAt?: Date;
  failedAttempts: number;
  lockedUntil?: Date;
}

// Simulated biometric data store (in production, use database)
const biometricStore = new Map<string, BiometricProfile>();

export const biometricService = {
  // Enroll a new biometric for a user
  enrollBiometric: async (
    userId: string,
    method: BiometricMethod,
    biometricData: string,
    metadata?: Record<string, any>
  ) => {
    try {
      const profile = biometricStore.get(userId) || {
        userId,
        enrolledMethods: [],
        primaryMethod: method,
        failedAttempts: 0,
      };

      const capture: BiometricCapture = {
        id: `bio-${Date.now()}`,
        method,
        verified: true,
        confidence: 0.98 + Math.random() * 0.02, // 98-100% confidence
        capturedAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        metadata,
      };

      if (method === 'fingerprint') {
        profile.fingerprint = capture;
      } else if (method === 'facial') {
        profile.facial = capture;
      } else if (method === 'voice') {
        profile.voice = capture;
      }

      if (!profile.enrolledMethods.includes(method)) {
        profile.enrolledMethods.push(method);
      }

      biometricStore.set(userId, profile);

      return {
        success: true,
        message: `${method} biometric enrolled successfully`,
        capture,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to enroll ${method} biometric`,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Verify biometric authentication
  verifyBiometric: async (
    userId: string,
    method: BiometricMethod,
    biometricData: string,
    metadata?: Record<string, any>
  ) => {
    try {
      const profile = biometricStore.get(userId);

      if (!profile || !profile.enrolledMethods.includes(method)) {
        return {
          success: false,
          message: `${method} biometric not enrolled for this user`,
          error: 'NOT_ENROLLED',
        };
      }

      // Check if account is temporarily locked due to failed attempts
      if (profile.lockedUntil && profile.lockedUntil > new Date()) {
        return {
          success: false,
          message: 'Biometric verification locked. Please try again later.',
          error: 'ACCOUNT_LOCKED',
          lockedUntil: profile.lockedUntil,
        };
      }

      // Simulate biometric verification (in production, compare with enrolled data)
      const confidence = 0.95 + Math.random() * 0.05; // 95-100% confidence
      const verified = confidence > 0.90; // Threshold for verification

      if (verified) {
        profile.failedAttempts = 0;
        profile.lastVerifiedAt = new Date();

        biometricStore.set(userId, profile);

        return {
          success: true,
          message: `${method} biometric verified successfully`,
          confidence,
          verified: true,
        };
      } else {
        profile.failedAttempts += 1;

        // Lock account after 5 failed attempts for 15 minutes
        if (profile.failedAttempts >= 5) {
          profile.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
        }

        biometricStore.set(userId, profile);

        return {
          success: false,
          message: `${method} biometric verification failed`,
          confidence,
          verified: false,
          failedAttempts: profile.failedAttempts,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Error verifying ${method} biometric`,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Get biometric enrollment status
  getBiometricStatus: async (userId: string) => {
    const profile = biometricStore.get(userId);

    if (!profile) {
      return {
        enrolled: false,
        methods: [],
        message: 'No biometric profile found',
      };
    }

    return {
      enrolled: profile.enrolledMethods.length > 0,
      methods: profile.enrolledMethods,
      primaryMethod: profile.primaryMethod,
      lastVerifiedAt: profile.lastVerifiedAt,
      failedAttempts: profile.failedAttempts,
    };
  },

  // Remove a biometric method
  removeBiometric: async (userId: string, method: BiometricMethod) => {
    const profile = biometricStore.get(userId);

    if (!profile) {
      return {
        success: false,
        message: 'Biometric profile not found',
        error: 'NOT_FOUND',
      };
    }

    if (method === 'fingerprint') {
      profile.fingerprint = undefined;
    } else if (method === 'facial') {
      profile.facial = undefined;
    } else if (method === 'voice') {
      profile.voice = undefined;
    }

    profile.enrolledMethods = profile.enrolledMethods.filter((m) => m !== method);

    if (profile.primaryMethod === method && profile.enrolledMethods.length > 0) {
      profile.primaryMethod = profile.enrolledMethods[0];
    }

    biometricStore.set(userId, profile);

    return {
      success: true,
      message: `${method} biometric removed`,
    };
  },
};
