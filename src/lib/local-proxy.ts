/**
 * Local Proxy System for Optional Dependencies
 * Provides fallback proxies for proprietary APIs and optional services
 * Used when QMOI_MINIMAL=true or when services are unavailable
 */

import { featureFlags } from './feature-flags';
import { offlineMode } from './offline-mode';

export interface ProxyConfig {
  service: string;
  enabled: boolean;
  fallbackUrl: string;
  fallbackDataUrl?: string; // Production-ready fallback data URL for optional services
  fallbackDataPath?: string; // legacy compatibility layer for older data path names
  timeout: number;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  cached: boolean;
  timestamp: number;
}

class LocalProxyManager {
  private proxies: Map<string, ProxyConfig> = new Map();
  private dataCache: Map<string, any> = new Map();
  private readonly isMinimal = process.env.QMOI_MINIMAL === 'true';

  constructor() {
    this.initializeProxies();
  }

  /**
   * Initialize all local proxies for optional services
   */
  private initializeProxies(): void {
    // Biometric services proxy
    this.registerProxy({
      service: 'biometric',
      enabled: !featureFlags.isEnabled('biometric_login'),
      fallbackUrl: '/api/local-proxies/biometric',
      fallbackDataUrl: '/fallback-data/biometric.json',
      fallbackDataPath: '/fallback-data/biometric.json',
      timeout: 5000,
    });

    // Voice services proxy
    this.registerProxy({
      service: 'voice',
      enabled: !featureFlags.isEnabled('voice_authentication'),
      fallbackUrl: '/api/local-proxies/voice',
      fallbackDataUrl: '/fallback-data/voice.json',
      fallbackDataPath: '/fallback-data/voice.json',
      timeout: 10000,
    });

    // Payment gateway proxy
    this.registerProxy({
      service: 'payments',
      enabled: this.isMinimal,
      fallbackUrl: '/api/local-proxies/payments',
      fallbackDataUrl: '/fallback-data/payments.json',
      fallbackDataPath: '/fallback-data/payments.json',
      timeout: 5000,
    });

    // Analytics proxy
    this.registerProxy({
      service: 'analytics',
      enabled: this.isMinimal || !featureFlags.isEnabled('advanced_analytics'),
      fallbackUrl: '/api/local-proxies/analytics',
      fallbackDataUrl: '/fallback-data/analytics.json',
      fallbackDataPath: '/fallback-data/analytics.json',
      timeout: 3000,
    });

    // Exchange rate service proxy
    this.registerProxy({
      service: 'exchange_rates',
      enabled: this.isMinimal,
      fallbackUrl: '/api/local-proxies/exchange-rates',
      fallbackDataUrl: '/fallback-data/exchange-rates.json',
      fallbackDataPath: '/fallback-data/exchange-rates.json',
      timeout: 5000,
    });

    // Video processing proxy
    this.registerProxy({
      service: 'video_processing',
      enabled: this.isMinimal,
      fallbackUrl: '/api/local-proxies/video',
      fallbackDataUrl: '/fallback-data/video.json',
      fallbackDataPath: '/fallback-data/video.json',
      timeout: 15000,
    });

    // ML inference proxy
    this.registerProxy({
      service: 'ml_inference',
      enabled: this.isMinimal,
      fallbackUrl: '/api/local-proxies/ml-inference',
      fallbackDataUrl: '/fallback-data/ml-inference.json',
      fallbackDataPath: '/fallback-data/ml-inference.json',
      timeout: 10000,
    });

    // Third-party APIs proxy
    this.registerProxy({
      service: 'third_party_apis',
      enabled: !featureFlags.isEnabled('proprietary_apis'),
      fallbackUrl: '/api/local-proxies/third-party',
      fallbackDataUrl: '/fallback-data/third-party-apis.json',
      fallbackDataPath: '/fallback-data/third-party-apis.json',
      timeout: 5000,
    });
  }

  /**
   * Register a service proxy
   */
  registerProxy(config: ProxyConfig): void {
    this.proxies.set(config.service, config);
  }

  /**
   * Get proxy for a service
   */
  getProxy(service: string): ProxyConfig | null {
    return this.proxies.get(service) || null;
  }

  /**
   * Check if service uses proxy
   */
  shouldUseProxy(service: string): boolean {
    const proxy = this.proxies.get(service);
    return proxy ? proxy.enabled : false;
  }

  /**
   * Call proxied service (with fallback)
   */
  async callProxiedService<T = any>(
    service: string,
    method: string,
    params?: any,
    options?: { useCache?: boolean; timeout?: number },
  ): Promise<ServiceResponse<T>> {
    const cacheKey = `proxy_${service}_${method}_${JSON.stringify(params || {})}`;

    // Check cache first
    if (options?.useCache && this.dataCache.has(cacheKey)) {
      return {
        success: true,
        data: this.dataCache.get(cacheKey),
        cached: true,
        timestamp: Date.now(),
      };
    }

    const proxy = this.getProxy(service);

    if (!proxy || !proxy.enabled) {
      return {
        success: false,
        error: `Service ${service} is not using proxy`,
        cached: false,
        timestamp: Date.now(),
      };
    }

    try {
      const response = await this.fetchWithTimeout(proxy.fallbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, params }),
        timeout: options?.timeout || proxy.timeout,
      });

      if (response.ok) {
        const data = await response.json();
        if (options?.useCache) {
          this.dataCache.set(cacheKey, data);
        }
        return {
          success: true,
          data,
          cached: false,
          timestamp: Date.now(),
        };
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      console.warn(`[LocalProxy] Error calling ${service}: ${error}`);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cached: false,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Fetch with timeout
   */
  private async fetchWithTimeout(url: string, options: any = {}): Promise<Response> {
    const timeout = options.timeout || 5000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      return await fetch(url, {
        ...options,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Get fallback data for a service in production/minimal mode.
   * Uses a configurable URL and gracefully falls back to the legacy data path if needed.
   */
  async getFallbackData<T = any>(service: string): Promise<T | null> {
    const cacheKey = `fallback_${service}`;

    if (this.dataCache.has(cacheKey)) {
      return this.dataCache.get(cacheKey) as T;
    }

    const proxy = this.getProxy(service);
    if (!proxy) return null;

    const url = proxy.fallbackDataUrl || proxy.fallbackDataPath;
    if (!url) return null;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        this.dataCache.set(cacheKey, data);
        return data as T;
      }
      console.warn(`[LocalProxy] Could not fetch fallback data for ${service}: HTTP ${response.status}`);
    } catch (error) {
      console.warn(`[LocalProxy] Error loading fallback data for ${service}:`, error);
    }

    return null;
  }

  /**
   * Create synthetic response (for offline/minimal mode)
   */
  createSyntheticResponse<T = any>(service: string, method: string, template?: T): ServiceResponse<T> {
    return {
      success: true,
      data: template,
      cached: false,
      timestamp: Date.now(),
    };
  }

  /**
   * Get all active proxies
   */
  getActiveProxies(): string[] {
    const active: string[] = [];
    for (const [service, config] of this.proxies) {
      if (config.enabled) {
        active.push(service);
      }
    }
    return active;
  }

  /**
   * Get proxy status
   */
  getStatus() {
    const status: any = {
      isMinimalMode: this.isMinimal,
      activeProxies: this.getActiveProxies(),
      proxies: {},
    };

    for (const [service, config] of this.proxies) {
      status.proxies[service] = {
        enabled: config.enabled,
        fallbackUrl: config.fallbackUrl,
        timeout: config.timeout,
      };
    }

    return status;
  }
}

export const localProxy = new LocalProxyManager();

/**
 * Hook for React components to use proxied services
 */
export async function useProxiedService<T = any>(
  service: string,
  method: string,
  params?: any,
): Promise<ServiceResponse<T>> {
  if (localProxy.shouldUseProxy(service)) {
    return localProxy.callProxiedService<T>(service, method, params, { useCache: true });
  }

  // Service is enabled, shouldn't use proxy
  return {
    success: false,
    error: `Service ${service} is not using proxy`,
    cached: false,
    timestamp: Date.now(),
  };
}
