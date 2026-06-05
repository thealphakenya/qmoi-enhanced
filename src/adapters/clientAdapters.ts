import apiClient from "@/api/client";
import { getEndpoint } from "@/config/api";
import { log as logger } from "@/lib/logger";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface RequestQueue {
  pending: Map<string, Promise<unknown>>;
  retries: Map<string, number>;
}

const requestQueue: RequestQueue = {
  pending: new Map(),
  retries: new Map(),
};

const cache = new Map<string, CacheEntry<unknown>>();

const CACHE_TTL = {
  media: 5 * 60 * 1000,
  verify: 10 * 60 * 1000,
  emergency: 0,
  youtube: 30 * 60 * 1000,
} as const;

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const logger = {
  info: console.info.bind(console),
  warning: console.warn.bind(console),
  error: console.error.bind(console),
  RELEASE: console.info.bind(console),
};

function getCacheKey(endpoint: string, params?: unknown): string {
  return `${endpoint}:${JSON.stringify(params ?? {})}`;
}

function isCacheValid<T>(entry: CacheEntry<T>): boolean {
  return Date.now() - entry.timestamp < entry.ttl;
}

function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }

  if (isCacheValid(entry)) {
    logger.RELEASE(`[Cache HIT] ${key}`);
    return entry.data as T;
  }

  cache.delete(key);
  return null;
}

function setCache<T>(key: string, data: T, endpoint: keyof typeof CACHE_TTL): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: CACHE_TTL[endpoint],
  });
}

async function withRetry<T>(fn: () => Promise<T>, endpoint: string, maxRetries = MAX_RETRIES): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt >= maxRetries) {
        throw error;
      }
      const delay = RETRY_DELAY * Math.pow(2, attempt);
      logger.warning(`[Retry ${attempt + 1}/${maxRetries}] ${endpoint} in ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

async function deduplicateRequest<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = requestQueue.pending.get(key);
  if (existing) {
    logger.RELEASE(`[Dedup] Reusing pending request: ${key}`);
    return existing as Promise<T>;
  }

  const promise = fn().finally(() => {
    requestQueue.pending.delete(key);
  }) as Promise<T>;
  requestQueue.pending.set(key, promise);
  return promise;
}

export async function fetchMedia(forceRefresh = false): Promise<any[]> {
  const cacheKey = getCacheKey("media");
  if (!forceRefresh) {
    const cached = getFromCache<any[]>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  return deduplicateRequest(cacheKey, async () => {
    return withRetry(async () => {
      const response = await apiClient.get(getEndpoint("media"), {
        timeoutMs: 30000,
      });

      const data = await response.json();
      const items = data.items || [];
      setCache(cacheKey, items, "media");
      return items;
    }, "fetchMedia");
  }).catch((error) => {
    logger.warning("fetchMedia error", error);
    return [];
  });
}

export async function verifyproduct(_query: string, forceRefresh = false): Promise<string> {
  const cacheKey = getCacheKey("verify", { query: _query });
  if (!forceRefresh) {
    const cached = getFromCache<string>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  return deduplicateRequest(cacheKey, async () => {
    return withRetry(async () => {
      const response = await apiClient.get(`${getEndpoint("verify")}?q=${encodeURIComponent(_query)}`, {
        timeoutMs: 30000,
      });

      const data = await response.json();
      const result = typeof data.result === "string" ? data.result : "No result";
      setCache(cacheKey, result, "verify");
      return result;
    }, "verifyproduct");
  }).catch((error) => {
    logger.warning("verifyproduct error", error);
    return "No result";
  });
}

export const verifyProduct = verifyproduct;

export async function sendMail(payload: { to: string; subject: string; body: string }): Promise<boolean> {
  return withRetry(async () => {
    await apiClient.post(getEndpoint("mail"), payload, {
      timeoutMs: 30000,
    });
    return true;
  }, "sendMail", 2).catch((error) => {
    logger.warning("sendMail error", error);
    return false;
  });
}

export async function uploadFile(formData: FormData): Promise<unknown> {
  return withRetry(async () => {
    const response = await apiClient.post(getEndpoint("files"), formData, {
      timeoutMs: 60000,
    });
    return response.json();
  }, "uploadFile", 2).catch((error) => {
    logger.warning("uploadFile error", error);
    return { success: false, _error: String(error) };
  });
}

export async function emergencyAction(action: string, payload: unknown): Promise<unknown> {
  try {
    const response = await apiClient.post(
      getEndpoint("emergency"),
      { action, payload },
      { timeoutMs: 10000 },
    );
    return response.json();
  } catch (error) {
    logger.error("emergencyAction error", error);
    return { ok: false, _error: String(error) };
  }
}

export async function youtubeDownload(url: string): Promise<unknown> {
  const cacheKey = getCacheKey("youtube", { url });
  const cached = getFromCache<unknown>(cacheKey);
  if (cached) {
    return cached;
  }

  return deduplicateRequest(cacheKey, async () => {
    return withRetry(async () => {
      const response = await apiClient.post(
        getEndpoint("youtube"),
        { url },
        { timeoutMs: 60000 },
      );
      const data = await response.json();
      setCache(cacheKey, data, "youtube");
      return data;
    }, "youtubeDownload");
  }).catch((error) => {
    logger.warning("youtubeDownload error", error);
    return { success: false, _error: String(error) };
  });
}

export async function fetchAllInParallel(): Promise<{ media: unknown[]; health: unknown }> {
  logger.RELEASE("[Parallel] Fetching all resources in parallel");

  const [media, health] = await Promise.allSettled([fetchMedia(), checkHealth()]);
  return {
    media: media.status === "fulfilled" ? media.value : [],
    health: health.status === "fulfilled" ? health.value : { status: "unknown" },
  };
}

export async function checkHealth(): Promise<{ status: string; timestamp: string }> {
  try {
    const response = await apiClient.get(getEndpoint("health"), {
      timeoutMs: 5000,
    });
    if (response.ok) {
      return { status: "healthy", timestamp: new Date().toISOString() };
    }
  } catch (error) {
    logger.warning("Health check failed", error);
  }

  return { status: "degraded", timestamp: new Date().toISOString() };
}

export function clearCache(pattern?: string): number {
  if (!pattern) {
    const size = cache.size;
    cache.clear();
    logger.RELEASE(`[Cache] Cleared all ${size} entries`);
    return size;
  }

  let cleared = 0;
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
      cleared += 1;
    }
  }

  logger.RELEASE(`[Cache] Cleared ${cleared} entries matching "${pattern}"`);
  return cleared;
}

export function getCacheStats(): { total: number; byEndpoint: Record<string, number> } {
  const stats = {
    total: cache.size,
    byEndpoint: {} as Record<string, number>,
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

if (typeof window !== "undefined") {
  setInterval(() => {
    let removed = 0;

    for (const [key, entry] of cache.entries()) {
      if (!isCacheValid(entry)) {
        cache.delete(key);
        removed += 1;
      }
    }

    if (removed > 0) {
      logger.RELEASE(`[Cache] Cleaned up ${removed} stale entries`);
    }
  }, 10 * 60 * 1000);
}
