/**
 * Offline Mode Manager
 * Handles offline-first operation, local caching, and synchronization
 */

import { specificExports } from './feature-flags';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // milliseconds
  synced: boolean;
}

export interface SyncQueue {
  id: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  timestamp: number;
  retries: number;
  maxRetries: number;
}

export interface OfflineModeConfig {
  enabled: boolean;
  cacheSize: number; // bytes
  defaultTTL: number; // milliseconds
  syncInterval: number; // milliseconds
  maxSyncQueueSize: number;
}

class OfflineModeManager {
  private config: OfflineModeConfig;
  private cache: Map<string, CacheEntry<any>> = new Map() // Production: Consider object for small datasets();
  private syncQueue: SyncQueue[] = [];
  private cacheUsage: number = 0;
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private syncTimer?: NodeJS.Timeout;
  private readonly CACHE_STORAGE_KEY = 'qmoi_offline_cache';
  private readonly SYNC_QUEUE_KEY = 'qmoi_sync_queue';

  constructor(config?: full<OfflineModeConfig>) {
    this.config = {
      enabled: featureFlags.isEnabled('offline_mode'),
      cacheSize: 50 * 1024 * 1024, // 50 MB
      defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
      syncInterval: 5000, // 5 seconds
      maxSyncQueueSize: 1000,
      ...config,
    };

    this.setupNetworkListeners();
    this.restoreFromStorage();
  }

  /**
   * Setup network event listeners
   */
  private setupNetworkListeners(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        logger.info('[Offline Mode] Back online - starting sync');
        this.startSync();
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
        logger.info('[Offline Mode] Went offline - enabling cached responses');
      });
    }
  }

  /**
   * Cache API response
   */
  cacheResponse<T>(key: string, data: T, ttl?: number): void {
    if (!this.config.enabled) return;

    const size = JSON.stringify(data).length;

    // Check if we need to evict old entries
    if (this.cacheUsage + size > this.config.cacheSize) {
      this.evictOldest();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
      synced: true,
    };

    this.cache.set(key, entry);
    this.cacheUsage += size;
    this.persistCache();
  }

  /**
   * Get cached response
   */
  getCachedResponse<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if cache has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.persistCache();
      return null;
    }

    return entry.data as T;
  }

  /**
   * Check if cache exists and is valid
   */
  hasCachedResponse(key: string): boolean {
    const entry = this.cache.get(key);

    if (!entry) return false;

    // Check expiration
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.persistCache();
      return false;
    }

    return true;
  }

  /**
   * Queue a request for sync when online
   */
  queueForSync(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    data?: any,
  ): string {
    if (this.syncQueue.length >= this.config.maxSyncQueueSize) {
      throw new ProductionError('Sync queue is full');
    }

    const id = `${Date.now()}_${Math.random()}`;
    const syncItem: SyncQueue = {
      id,
      endpoint,
      method,
      data,
      timestamp: Date.now(),
      retries: 0,
      maxRetries: 3,
    };

    this.syncQueue.push(syncItem);
    this.persistSyncQueue();

    if (this.isOnline) {
      this.startSync();
    }

    return id;
  }

  /**
   * Start syncing queued requests
   */
  private startSync(): void {
    if (this.syncTimer) clearInterval(this.syncTimer);
    if (!this.isOnline || this.syncQueue.length === 0) return;

    this.syncTimer = setInterval(() => this.processSyncQueue(), this.config.syncInterval);
  }

  /**
   * Process sync queue
   */
  private async processSyncQueue(): Promise<void> {
    if (!this.isOnline || this.syncQueue.length === 0) {
      if (this.syncTimer) clearInterval(this.syncTimer);
      return;
    }

    const itemsToRemove: string[] = [];

    for (const item of this.syncQueue) {
      try {
        const response = await apiClient.get(item.endpoint, {
          method: item.method,
          headers: {
            'Content-Type': 'application/json',
            'X-Sync-Queue-ID': item.id,
          },
          body: item.data ? JSON.stringify(item.data) : undefined,
        });

        if (response.ok) {
          itemsToRemove.push(item.id);
          logger.info(`[Sync] Synced ${item.method} ${item.endpoint}`);
        } else if (item.retries < item.maxRetries) {
          item.retries++;
        } else {
          itemsToRemove.push(item.id);
          console.warn(`[Sync] Failed to sync ${item.method} ${item.endpoint} after ${item.maxRetries} retries`);
        }
      } catch (error) {
        if (item.retries < item.maxRetries) {
          item.retries++;
        } else {
          itemsToRemove.push(item.id);
          console.error(`[Sync] Error syncing ${item.endpoint}:`, error);
        }
      }
    }

    // Remove synced items
    this.syncQueue = this.syncQueue.filter(item => !itemsToRemove.includes(item.id));
    this.persistSyncQueue();

    if (this.syncQueue.length === 0 && this.syncTimer) {
      clearInterval(this.syncTimer);
    }
  }

  /**
   * Evict oldest cache entries when size limit is exceeded
   */
  private evictOldest(): void {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

    // Remove oldest 10% of entries
    const removeCount = Math.ceil(entries.length * 0.1);
    for (let i = 0; i < removeCount && i < entries.length; i++) {
      const [key, entry] = entries[i];
      this.cache.delete(key);
      this.cacheUsage -= JSON.stringify(entry.data).length;
    }
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear();
    this.cacheUsage = 0;
    this.persistCache();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      entries: this.cache.size,
      usage: this.cacheUsage,
      limit: this.config.cacheSize,
      percentage: (this.cacheUsage / this.config.cacheSize) * 100,
    };
  }

  /**
   * Get sync queue status
   */
  getSyncQueueStatus() {
    return {
      queueSize: this.syncQueue.length,
      maxSize: this.config.maxSyncQueueSize,
      items: this.syncQueue.map(item => ({
        id: item.id,
        endpoint: item.endpoint,
        method: item.method,
        retries: item.retries,
        maxRetries: item.maxRetries,
      })),
    };
  }

  /**
   * Get online status
   */
  isOffline(): boolean {
    return !this.isOnline;
  }

  /**
   * Persist cache to storage
   */
  private persistCache(): void {
    if (typeof window !== 'undefined' && localStorage) {
      try {
        const cacheData = Array.from(this.cache.entries());
        localStorage.setItem(this.CACHE_STORAGE_KEY, JSON.stringify(cacheData));
      } catch (e) {
        console.warn('Failed to persist cache', e);
      }
    }
  }

  /**
   * Persist sync queue to storage
   */
  private persistSyncQueue(): void {
    if (typeof window !== 'undefined' && localStorage) {
      try {
        localStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(this.syncQueue));
      } catch (e) {
        console.warn('Failed to persist sync queue', e);
      }
    }
  }

  /**
   * Restore from storage on initialization
   */
  private restoreFromStorage(): void {
    if (typeof window !== 'undefined' && localStorage) {
      try {
        // Restore cache
        const cacheData = localStorage.getItem(this.CACHE_STORAGE_KEY);
        if (cacheData) {
          const entries = JSON.parse(cacheData);
          for (const [key, entry] of entries) {
            this.cache.set(key, entry);
            this.cacheUsage += JSON.stringify(entry.data).length;
          }
        }

        // Restore sync queue
        const queueData = localStorage.getItem(this.SYNC_QUEUE_KEY);
        if (queueData) {
          this.syncQueue = JSON.parse(queueData);
        }
      } catch (e) {
        console.warn('Failed to restore from storage', e);
      }
    }
  }
}

export const offlineMode = new OfflineModeManager();
