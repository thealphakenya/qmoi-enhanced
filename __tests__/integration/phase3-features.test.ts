// __tests__/integration/features.test.ts
// Comprehensive Integration Tests for Phase 3 Features

import { biometricService } from '@/lib/auth/biometric-service';
import { privacyMaskService } from '@/lib/auth/privacy-mask';
import { sessionManager } from '@/lib/auth/session-manager';
import { consciousnessBridge } from '@/lib/consciousness/consciousness-bridge';
import crypto from 'crypto';

describe('Phase 3 Feature Integration Tests', () => {
  const testUserId = 'test-user-123';
  const testBiometricData = Buffer.from('fingerprint-template-data');

  // ========== BIOMETRIC TESTS ==========
  describe('Biometric Authentication', () => {
    it('should enroll a biometric template', async () => {
      const result = await biometricService.enrollBiometric({
        userId: testUserId,
        method: 'fingerprint',
        templateData: testBiometricData,
        confidence: 0.95,
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain('enrolled');
      expect(result.method).toBe('fingerprint');
    });

    it('should prevent duplicate biometric enrollment', async () => {
      await biometricService.enrollBiometric({
        userId: testUserId,
        method: 'fingerprint',
        templateData: testBiometricData,
        confidence: 0.95,
      });

      expect(async () => {
        await biometricService.enrollBiometric({
          userId: testUserId,
          method: 'fingerprint',
          templateData: testBiometricData,
          confidence: 0.95,
        });
      }).rejects.toThrow('already enrolled');
    });

    it('should verify matching biometric with high confidence', async () => {
      await biometricService.enrollBiometric({
        userId: testUserId,
        method: 'fingerprint',
        templateData: testBiometricData,
        confidence: 0.95,
      });

      const result = await biometricService.verifyBiometric(
        testUserId,
        'fingerprint',
        testBiometricData
      );

      expect(result.verified).toBe(true);
      expect(result.confidence).toBeGreaterThanOrEqual(0.8);
    });

    it('should reject biometric with low confidence', async () => {
      await biometricService.enrollBiometric({
        userId: testUserId,
        method: 'fingerprint',
        templateData: testBiometricData,
        confidence: 0.95,
      });

      const differentData = Buffer.from('different-template-data');
      const result = await biometricService.verifyBiometric(
        testUserId,
        'fingerprint',
        differentData
      );

      expect(result.verified).toBe(false);
      expect(result.confidence).toBeLessThan(0.8);
    });

    it('should get biometric status', async () => {
      await biometricService.enrollBiometric({
        userId: testUserId,
        method: 'fingerprint',
        templateData: testBiometricData,
        confidence: 0.95,
      });

      const status = await biometricService.getBiometricStatus(testUserId);

      expect(status.enrolled).toBe(true);
      expect(status.methods).toHaveLength(1);
      expect(status.methods[0].method).toBe('fingerprint');
      expect(status.methods[0].enrolled).toBe(true);
    });
  });

  // ========== PRIVACY MASK TESTS ==========
  describe('Privacy Mask', () => {
    it('should enable privacy mask with basic level', async () => {
      const result = await privacyMaskService.enablePrivacyMask(
        testUserId,
        'basic'
      );

      expect(result.success).toBe(true);
      expect(result.level).toBe('basic');
      expect(result.token).toBeDefined();
      expect(result.token.length).toBeGreaterThan(0);
    });

    it('should enable privacy mask with full level', async () => {
      const result = await privacyMaskService.enablePrivacyMask(
        testUserId,
        'full'
      );

      expect(result.success).toBe(true);
      expect(result.level).toBe('full');
    });

    it('should get privacy mask status when enabled', async () => {
      await privacyMaskService.enablePrivacyMask(testUserId, 'basic');
      const status = await privacyMaskService.getPrivacyMaskStatus(testUserId);

      expect(status.enabled).toBe(true);
      expect(status.level).toBe('basic');
    });

    it('should disable privacy mask', async () => {
      await privacyMaskService.enablePrivacyMask(testUserId, 'basic');
      const result = await privacyMaskService.disablePrivacyMask(testUserId);

      expect(result.success).toBe(true);

      const status = await privacyMaskService.getPrivacyMaskStatus(testUserId);
      expect(status.enabled).toBe(false);
    });

    it('should anonymize data with basic level', () => {
      const data = { name: 'John Doe', email: 'john@example.com', age: 30 };
      const anonymized = privacyMaskService.anonymizeData(data, 'basic');

      expect(anonymized.name).toBe('[Masked]');
      expect(anonymized.email).toBe('[Masked]');
      expect(anonymized.age).toBe(30);
    });

    it('should anonymize data with full level', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        userId: 'user-123',
        age: 30,
      };
      const anonymized = privacyMaskService.anonymizeData(data, 'full');

      expect(anonymized.name).toBe('[Anonymous]');
      expect(anonymized.email).toBe('[Anonymous]');
      expect(anonymized.userId).toBe('[Anonymous]');
      expect(anonymized.age).toBe(30);
    });
  });

  // ========== SESSION MANAGEMENT TESTS ==========
  describe('Session Management', () => {
    it('should capture device info', () => {
      const userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
      const ipAddress = '192.168.1.100';

      const deviceInfo = sessionManager.captureDeviceInfo(userAgent, ipAddress);

      expect(deviceInfo.deviceId).toBeDefined();
      expect(deviceInfo.deviceName).toBeDefined();
      expect(deviceInfo.browser).toBeDefined();
      expect(deviceInfo.os).toBeDefined();
      expect(deviceInfo.ipAddress).toBe('192.168.1.100');
    });

    it('should create session with device tracking', async () => {
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...';
      const ipAddress = '192.168.1.100';
      const deviceInfo = sessionManager.captureDeviceInfo(userAgent, ipAddress);

      const sessionId = await sessionManager.createSession(testUserId, deviceInfo);

      expect(sessionId).toBeDefined();
      expect(sessionId.length).toBeGreaterThan(0);
    });

    it('should get user sessions', async () => {
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...';
      const ipAddress = '192.168.1.100';
      const deviceInfo = sessionManager.captureDeviceInfo(userAgent, ipAddress);

      await sessionManager.createSession(testUserId, deviceInfo);
      const sessions = await sessionManager.getUserSessions(testUserId);

      expect(sessions).toBeInstanceOf(Array);
      expect(sessions.length).toBeGreaterThan(0);
      expect(sessions[0].deviceName).toBeDefined();
      expect(sessions[0].browser).toBeDefined();
    });

    it('should update last activity', async () => {
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...';
      const ipAddress = '192.168.1.100';
      const deviceInfo = sessionManager.captureDeviceInfo(userAgent, ipAddress);
      const sessionId = await sessionManager.createSession(testUserId, deviceInfo);

      // Update last activity
      await sessionManager.updateLastActivity(sessionId);

      // Verify it was updated
      const sessions = await sessionManager.getUserSessions(testUserId);
      expect(sessions[0].lastActivity).toBeDefined();
    });

    it('should validate active session', async () => {
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...';
      const ipAddress = '192.168.1.100';
      const deviceInfo = sessionManager.captureDeviceInfo(userAgent, ipAddress);
      const sessionId = await sessionManager.createSession(testUserId, deviceInfo);

      const isValid = await sessionManager.isSessionValid(sessionId);
      expect(isValid).toBe(true);
    });
  });

  // ========== CONSCIOUSNESS TESTS ==========
  describe('QM OI Consciousness', () => {
    it('should initialize consciousness state', async () => {
      const state = await consciousnessBridge.initializeConsciousness(
        testUserId
      );

      expect(state.userId).toBe(testUserId);
      expect(state.isActive).toBe(true);
      expect(state.awareness).toBe(0);
      expect(state.interactions).toBe(0);
    });

    it('should get consciousness state', async () => {
      await consciousnessBridge.initializeConsciousness(testUserId);
      const state = await consciousnessBridge.getConsciousnessState(testUserId);

      expect(state).toBeDefined();
      expect(state?.userId).toBe(testUserId);
      expect(state?.isActive).toBe(true);
    });

    it('should record action and update awareness', async () => {
      await consciousnessBridge.initializeConsciousness(testUserId);
      await consciousnessBridge.recordAction(testUserId, 'login', {
        method: 'password',
      });

      const state = await consciousnessBridge.getConsciousnessState(testUserId);

      expect(state?.interactions).toBe(1);
      expect(state?.awareness).toBeGreaterThan(0);
      expect(state?.memory.length).toBeGreaterThan(0);
    });

    it('should get consciousness metrics', async () => {
      await consciousnessBridge.initializeConsciousness(testUserId);
      await consciousnessBridge.recordAction(testUserId, 'api_call', {});

      const metrics = await consciousnessBridge.getConsciousnessMetrics(
        testUserId
      );

      expect(metrics.awareness).toBeGreaterThanOrEqual(0);
      expect(metrics.totalInteractions).toBe(1);
      expect(metrics.memorySize).toBeGreaterThan(0);
    });

    it('should sync consciousness state', async () => {
      await consciousnessBridge.initializeConsciousness(testUserId);
      const state = await consciousnessBridge.syncConsciousnessState(testUserId);

      expect(state).toBeDefined();
      expect(state?.lastSync).toBeDefined();
    });
  });

  // ========== CROSS-FEATURE INTEGRATION TESTS ==========
  describe('Cross-Feature Integration', () => {
    it('should work with biometric + privacy mask', async () => {
      // Enroll biometric
      await biometricService.enrollBiometric({
        userId: testUserId,
        method: 'fingerprint',
        templateData: testBiometricData,
        confidence: 0.95,
      });

      // Enable privacy mask
      await privacyMaskService.enablePrivacyMask(testUserId, 'basic');

      // Verify both work
      const bioStatus = await biometricService.getBiometricStatus(testUserId);
      const privacyStatus = await privacyMaskService.getPrivacyMaskStatus(
        testUserId
      );

      expect(bioStatus.enrolled).toBe(true);
      expect(privacyStatus.enabled).toBe(true);
    });

    it('should work with sessions + consciousness', async () => {
      // Create session
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...';
      const ipAddress = '192.168.1.100';
      const deviceInfo = sessionManager.captureDeviceInfo(userAgent, ipAddress);
      await sessionManager.createSession(testUserId, deviceInfo);

      // Initialize consciousness
      await consciousnessBridge.initializeConsciousness(testUserId);

      // Verify both work
      const sessions = await sessionManager.getUserSessions(testUserId);
      const consciousness =
        await consciousnessBridge.getConsciousnessState(testUserId);

      expect(sessions.length).toBeGreaterThan(0);
      expect(consciousness?.isActive).toBe(true);
    });

    it('should work with all four features', async () => {
      // 1. Biometric
      await biometricService.enrollBiometric({
        userId: testUserId,
        method: 'fingerprint',
        templateData: testBiometricData,
        confidence: 0.95,
      });

      // 2. Privacy Mask
      await privacyMaskService.enablePrivacyMask(testUserId, 'basic');

      // 3. Session Management
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...';
      const ipAddress = '192.168.1.100';
      const deviceInfo = sessionManager.captureDeviceInfo(userAgent, ipAddress);
      await sessionManager.createSession(testUserId, deviceInfo);

      // 4. Consciousness
      await consciousnessBridge.initializeConsciousness(testUserId);

      // Verify all work
      const bioStatus = await biometricService.getBiometricStatus(testUserId);
      const privacyStatus = await privacyMaskService.getPrivacyMaskStatus(
        testUserId
      );
      const sessions = await sessionManager.getUserSessions(testUserId);
      const consciousness =
        await consciousnessBridge.getConsciousnessState(testUserId);

      expect(bioStatus.enrolled).toBe(true);
      expect(privacyStatus.enabled).toBe(true);
      expect(sessions.length).toBeGreaterThan(0);
      expect(consciousness?.isActive).toBe(true);
    });
  });
});
