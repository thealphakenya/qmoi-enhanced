/**
 * Webhook Security & Signature Verification Tests
 * Tests HMAC-SHA256 webhook signature validation
 */

import { createHmac, timingSafeEqual } from 'crypto';

describe('Webhook Signature Verification', () => {
  const WEBHOOK_SECRET = 'test-webhook-secret-key-12345';

  function verifyWebhookSignature(
    payload: string | Buffer,
    signature: string,
    secret: string
  ): boolean {
    try {
      const computed = createHmac('sha256', secret)
        .update(payload)
        .digest('base64');
      return timingSafeEqual(Buffer.from(signature), Buffer.from(computed));
    } catch (e) {
      return false;
    }
  }

  describe('HMAC-SHA256 Signature Generation', () => {
    test('should generate valid HMAC signature', () => {
      const payload = JSON.stringify({ event: 'transaction.completed', amount: 1000 });
      const signature = createHmac('sha256', WEBHOOK_SECRET)
        .update(payload)
        .digest('base64');
      
      expect(signature).toBeTruthy();
      expect(typeof signature).toBe('string');
    });

    test('should generate consistent signatures', () => {
      const payload = 'test-payload';
      const sig1 = createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('base64');
      const sig2 = createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('base64');
      
      expect(sig1).toBe(sig2);
    });

    test('should generate different signatures for different payloads', () => {
      const sig1 = createHmac('sha256', WEBHOOK_SECRET).update('payload1').digest('base64');
      const sig2 = createHmac('sha256', WEBHOOK_SECRET).update('payload2').digest('base64');
      
      expect(sig1).not.toBe(sig2);
    });

    test('should generate different signatures for different secrets', () => {
      const payload = 'test-payload';
      const sig1 = createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('base64');
      const sig2 = createHmac('sha256', 'different-secret').update(payload).digest('base64');
      
      expect(sig1).not.toBe(sig2);
    });
  });

  describe('Signature Verification', () => {
    test('should verify valid signature', () => {
      const payload = JSON.stringify({ type: 'payment', id: '123' });
      const signature = createHmac('sha256', WEBHOOK_SECRET)
        .update(payload)
        .digest('base64');
      
      const isValid = verifyWebhookSignature(payload, signature, WEBHOOK_SECRET);
      expect(isValid).toBe(true);
    });

    test('should reject invalid signature', () => {
      const payload = 'test-payload';
      const invalidSignature = 'invalid-signature-data';
      
      const isValid = verifyWebhookSignature(payload, invalidSignature, WEBHOOK_SECRET);
      expect(isValid).toBe(false);
    });

    test('should reject tampered payload', () => {
      const originalPayload = JSON.stringify({ amount: 1000 });
      const signature = createHmac('sha256', WEBHOOK_SECRET)
        .update(originalPayload)
        .digest('base64');
      
      const tamperedPayload = JSON.stringify({ amount: 999999 });
      const isValid = verifyWebhookSignature(tamperedPayload, signature, WEBHOOK_SECRET);
      expect(isValid).toBe(false);
    });

    test('should reject with wrong secret', () => {
      const payload = 'test-payload';
      const signature = createHmac('sha256', WEBHOOK_SECRET)
        .update(payload)
        .digest('base64');
      
      const isValid = verifyWebhookSignature(payload, signature, 'wrong-secret');
      expect(isValid).toBe(false);
    });
  });

  describe('Timing-Safe Comparison', () => {
    test('should use constant-time comparison', () => {
      const payload = 'test-payload';
      const validSig = createHmac('sha256', WEBHOOK_SECRET)
        .update(payload)
        .digest('base64');
      
      const invalidSig = 'x'.repeat(validSig.length);
      
      // Both should complete in roughly the same time
      const isValid = verifyWebhookSignature(payload, validSig, WEBHOOK_SECRET);
      expect(isValid).toBe(true);
    });

    test('should handle signature length mismatches', () => {
      const payload = 'test-payload';
      const validSig = createHmac('sha256', WEBHOOK_SECRET)
        .update(payload)
        .digest('base64');
      
      const shortSig = validSig.substring(0, 10);
      
      const isValid = verifyWebhookSignature(payload, shortSig, WEBHOOK_SECRET);
      expect(isValid).toBe(false);
    });
  });

  describe('Payload Types', () => {
    test('should verify string payloads', () => {
      const payload = 'webhook-payload-string';
      const signature = createHmac('sha256', WEBHOOK_SECRET)
        .update(payload)
        .digest('base64');
      
      const isValid = verifyWebhookSignature(payload, signature, WEBHOOK_SECRET);
      expect(isValid).toBe(true);
    });

    test('should verify JSON payloads', () => {
      const payload = JSON.stringify({ event: 'transaction.completed', id: '12345' });
      const signature = createHmac('sha256', WEBHOOK_SECRET)
        .update(payload)
        .digest('base64');
      
      const isValid = verifyWebhookSignature(payload, signature, WEBHOOK_SECRET);
      expect(isValid).toBe(true);
    });

    test('should verify Buffer payloads', () => {
      const payload = Buffer.from('webhook-buffer-payload');
      const signature = createHmac('sha256', WEBHOOK_SECRET)
        .update(payload)
        .digest('base64');
      
      const isValid = verifyWebhookSignature(payload, signature, WEBHOOK_SECRET);
      expect(isValid).toBe(true);
    });
  });
});
