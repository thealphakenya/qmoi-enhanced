// Client-side adapters for production integrations with parallel execution support
// Features: Caching, retry logic, background operations, request queuing, error recovery
// These call backend API endpoints (preferred) which should implement real third-party integrations.
// If the backend is not configured, these functions throw or return safe errors which the UI handles.

import { getEndpoint } from "../config/api";

// ============================================================================
// CONFIGURATION & CACHE MANAGEMENT
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface RequestQueue {
  pending: Map<string, Promise<any>>;
  retries: Map<string, number>;
}

// In-memory cache for adapter results (TTL-based)
const cache = new Map<string, CacheEntry<any>>();
const requestQueue: RequestQueue = {
  pending: new Map(),
  retries: new Map(),
};

const CACHE_TTL = {
  media: 5 * 60 * 1000, // 5 minutes
  verify: 10 * 60 * 1000, // 10 minutes
  mail: 0, // No cache (real-time action)
  files: 0, // No cache (real-time action)
  emergency: 0, // No cache (critical action)
  youtube: 30 * 60 * 1000, // 30 minutes
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getCacheKey(endpoint: string, params?: any): string {
  return `${endpoint}:${JSON.stringify(params || {})}`;
}

function isCacheValid<T>(entry: CacheEntry<T>): boolean {
  return Date.now() - entry.timestamp < entry.ttl;
}

function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && isCacheValid(entry)) {
    console.debug(`[Cache HIT] ${key}`);
    return entry.data;
  }
  if (entry) cache.delete(key);
  return null;
}

function setCache<T>(
  key: string,
  data: T,
  endpoint: keyof typeof CACHE_TTL,
): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: CACHE_TTL[endpoint],
  });
}

async function withRetry<T>(
  fn: () => Promise<T>,
  endpoint: string,
  maxRetries = MAX_RETRIES,
): Promise<T> {
  let lastError: any;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < maxRetries) {
        const delay = RETRY_DELAY * Math.pow(2, i); // exponential backoff
        console.warn(
          `[Retry ${i + 1}/${maxRetries}] ${endpoint} in ${delay}ms`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

async function deduplicateRequest<T>(
  key: string,
  fn: () => Promise<T>,
): Promise<T> {
  if (requestQueue.pending.has(key)) {
    console.debug(`[Dedup] Reusing pending request: ${key}`);
    return requestQueue.pending.get(key) as Promise<T>;
  }
  const promise = fn().finally(() => {
    requestQueue.pending.delete(key);
  });
  requestQueue.pending.set(key, promise);
  return promise;
}

// ============================================================================
// ADAPTER FUNCTIONS - WITH PARALLEL & BACKGROUND SUPPORT
// ============================================================================

export async function fetchMedia(forceRefresh = false): Promise<any[]> {
  const cacheKey = getCacheKey("media");

  // Check cache first (unless force refresh)
  if (!forceRefresh) {
    const cached = getFromCache<any[]>(cacheKey);
    if (cached) return cached;
  }

  return deduplicateRequest(cacheKey, async () => {
    return withRetry(async () => {
      const res = await fetch(getEndpoint("media"), {
        signal: AbortSignal.timeout(30000), // 30s timeout
      });
      if (!res.ok) throw new Error(`media fetch failed: ${res.status}`);
      const data = await res.json();
      const items = data.items || [];
      setCache(cacheKey, items, "media");
      return items;
    }, "fetchMedia");
  }).catch((err) => {
    console.warn("fetchMedia error", err);
    return [];
  });
}

export async function verifyProduct(
  query: string,
  forceRefresh = false,
): Promise<string> {
  const cacheKey = getCacheKey("verify", { query });

  if (!forceRefresh) {
    const cached = getFromCache<string>(cacheKey);
    if (cached) return cached;
  }

  return deduplicateRequest(cacheKey, async () => {
    return withRetry(async () => {
      const res = await fetch(
        `${getEndpoint("verify")}?q=${encodeURIComponent(query)}`,
        { signal: AbortSignal.timeout(30000) },
      );
      if (!res.ok) throw new Error(`verify failed: ${res.status}`);
      const data = await res.json();
      const result = data.result || "No result";
      setCache(cacheKey, result, "verify");
      return result;
    }, "verifyProduct");
  }).catch((err) => {
    console.warn("verifyProduct error", err);
    return `Verification unavailable: ${String(err)}`;
  });
}

export async function sendMail(payload: {
  to: string;
  subject: string;
  body: string;
}): Promise<boolean> {
  return withRetry(
    async () => {
      const res = await fetch(getEndpoint("mail"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000),
      });
      if (!res.ok) throw new Error(`mail failed: ${res.status}`);
      return true;
    },
    "sendMail",
    2,
  ) // 2 retries for mail
    .catch((err) => {
      console.warn("sendMail error", err);
      return false;
    });
}

export async function uploadFile(formData: FormData): Promise<any> {
  return withRetry(
    async () => {
      const res = await fetch(getEndpoint("files"), {
        method: "POST",
        body: formData,
        signal: AbortSignal.timeout(60000), // 60s timeout for large files
      });
      if (!res.ok) throw new Error(`upload failed: ${res.status}`);
      return await res.json();
    },
    "uploadFile",
    2,
  ).catch((err) => {
    console.warn("uploadFile error", err);
    return { success: false, error: String(err) };
  });
}

export async function emergencyAction(
  action: string,
  payload: any,
): Promise<any> {
  // Emergency actions skip retry logic for speed
  try {
    const res = await fetch(getEndpoint("emergency"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, payload }),
      signal: AbortSignal.timeout(10000), // 10s timeout for emergency
    });
    const result = await res.json();
    console.info(`[Emergency] Action ${action} executed:`, result);
    return result;
  } catch (err) {
    console.error("emergencyAction error", err);
    return { ok: false, error: String(err) };
  }
}

export async function youtubeDownload(url: string): Promise<any> {
  const cacheKey = getCacheKey("youtube", { url });

  const cached = getFromCache<any>(cacheKey);
  if (cached) return cached;

  return deduplicateRequest(cacheKey, async () => {
    return withRetry(async () => {
      const res = await fetch(getEndpoint("youtube"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
        signal: AbortSignal.timeout(60000),
      });
      if (!res.ok) throw new Error(`youtube download failed: ${res.status}`);
      const data = await res.json();
      setCache(cacheKey, data, "youtube");
      return data;
    }, "youtubeDownload");
  }).catch((err) => {
    console.warn("youtubeDownload error", err);
    return { success: false, error: String(err) };
  });
}

// ============================================================================
// PARALLEL EXECUTION HELPERS
// ============================================================================

export async function fetchAllInParallel(): Promise<{
  media: any[];
  health: any;
}> {
  console.debug("[Parallel] Fetching all resources in parallel...");
  const [media, health] = await Promise.allSettled([
    fetchMedia(),
    checkHealth(),
  ]);

  return {
    media: media.status === "fulfilled" ? media.value : [],
    health:
      health.status === "fulfilled" ? health.value : { status: "unknown" },
  };
}

export async function checkHealth(): Promise<{
  status: string;
  timestamp: string;
}> {
  try {
    const res = await fetch(getEndpoint("health"), {
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      return { status: "healthy", timestamp: new Date().toISOString() };
    }
  } catch (err) {
    console.warn("Health check failed", err);
  }
  return { status: "degraded", timestamp: new Date().toISOString() };
}

// ============================================================================
// CACHE MANAGEMENT & CLEANUP
// ============================================================================

export function clearCache(pattern?: string): number {
  if (!pattern) {
    const size = cache.size;
    cache.clear();
    console.debug(`[Cache] Cleared all ${size} entries`);
    return size;
  }

  let cleared = 0;
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
      cleared++;
    }
  }
  console.debug(`[Cache] Cleared ${cleared} entries matching "${pattern}"`);
  return cleared;
}

export function getCacheStats(): {
  total: number;
  byEndpoint: { [key: string]: number };
} {
  const stats = {
    total: cache.size,
    byEndpoint: {} as { [key: string]: number },
  };

  for (const key of cache.keys()) {
    const endpoint = key.split(":")[0];
    stats.byEndpoint[endpoint] = (stats.byEndpoint[endpoint] || 0) + 1;
  }

  return stats;
}

export function getPendingRequests(): string[] {
  return Array.from(requestQueue.pending.keys());
}

// Cleanup stale cache entries every 10 minutes
if (typeof window !== "undefined") {
  setInterval(
    () => {
      let removed = 0;
      for (const [key, entry] of cache.entries()) {
        if (!isCacheValid(entry)) {
          cache.delete(key);
          removed++;
        }
      }
      if (removed > 0)
        console.debug(`[Cache] Cleaned up ${removed} stale entries`);
    },
    10 * 60 * 1000,
  );
}
