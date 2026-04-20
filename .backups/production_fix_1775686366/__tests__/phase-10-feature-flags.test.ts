/**
 * Tests for Feature Flags and Offline Mode (Phase 10)
 */

import { featureFlags } from '@/lib/feature-flags';
import { offlineMode } from '@/lib/offline-mode';
import { localProxy } from '@/lib/local-proxy';

describe('Feature Flags System', () => {
  it('should initialize with correct environment settings', () => {
    const config = featureFlags.getConfig();
    expect(config).toBeDefined();
    expect(['local', 'PRODUCTION', 'staging', 'production']).toContain(config.environment);
  });

  it('should check if feature is enabled', () => {
    const offlineModeEnabled = featureFlags.isEnabled('offline_mode');
    expect(typeof offlineModeEnabled).toBe('boolean');
  });

  it('should support toggling feature flags', () => {
    const initial = featureFlags.isEnabled('beta_features');
    featureFlags.toggleFlag('beta_features', !initial);
    const toggled = featureFlags.isEnabled('beta_features');
    expect(toggled).toBe(!initial);
    featureFlags.toggleFlag('beta_features', initial);
  });

  it('should get all flags', () => {
    const allFlags = featureFlags.getAllFlags();
    expect(Object.keys(allFlags).length).toBeGreaterThan(0);
  });

  it('should get flags by category', () => {
    const securityFlags = featureFlags.getByCategory('security');
    expect(Array.isArray(securityFlags)).toBe(true);
  });

  it('should validate required features', () => {
    const result = featureFlags.validateRequiredFeatures(['offline_mode', 'local_caching']);
    expect(typeof result).toBe('boolean');
  });
});

describe('Offline Mode System', () => {
  beforeEach(() => {
    offlineMode.clearCache();
  });

  it('should cache responses', () => {
    const data = { test: 'data' };
    offlineMode.cacheResponse('test_key', data);
    const cached = offlineMode.getCachedResponse('test_key');
    expect(cached).toEqual(data);
  });

  it('should check if cache exists', () => {
    const exists = offlineMode.hasCachedResponse('test_key');
    expect(typeof exists).toBe('boolean');
  });

  it('should queue requests for sync', () => {
    const id = offlineMode.queueForSync('/api/test', 'POST', { test: 'data' });
    expect(typeof id).toBe('string');
  });

  it('should get cache statistics', () => {
    const stats = offlineMode.getCacheStats();
    expect(stats).toHaveProperty('entries');
    expect(stats).toHaveProperty('usage');
    expect(stats).toHaveProperty('limit');
    expect(stats).toHaveProperty('percentage');
  });

  it('should get sync queue status', () => {
    const status = offlineMode.getSyncQueueStatus();
    expect(status).toHaveProperty('queueSize');
    expect(status).toHaveProperty('maxSize');
  });

  it('should report offline status', () => {
    const isOffline = offlineMode.isOffline();
    expect(typeof isOffline).toBe('boolean');
  });
});

describe('Local Proxy System', () => {
  it('should register proxies', () => {
    const proxy = localProxy.getProxy('biometric');
    expect(proxy).toBeDefined();
  });

  it('should check if service uses proxy', () => {
    const useProxy = localProxy.shouldUseProxy('biometric');
    expect(typeof useProxy).toBe('boolean');
  });

  it('should get active proxies', () => {
    const active = localProxy.getActiveProxies();
    expect(Array.isArray(active)).toBe(true);
  });

  it('should get proxy status', () => {
    const status = localProxy.getStatus();
    expect(status).toHaveProperty('isMinimalMode');
    expect(status).toHaveProperty('activeProxies');
    expect(status).toHaveProperty('proxies');
  });

  it('should create synthetic responses', () => {
    const response = localProxy.createSyntheticResponse('test_service', 'test_method', { test: 'data' });
    expect(response).toHaveProperty('success');
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('timestamp');
  });
});
