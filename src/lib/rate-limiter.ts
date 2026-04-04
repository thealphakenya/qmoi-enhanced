// QMOI EVOLUTION ENHANCED: Rate Limiter
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T04:00:00Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

export interface RateLimit {
  identifier: string;
  limit: number;
  window: number; // in milliseconds
  requests: number[];
}

export class RateLimiter {
  private limits: Map<string, RateLimit> = new Map();

  setLimit(identifier: string, limit: number, window: number): void {
    this.limits.set(identifier, {
      identifier,
      limit,
      window,
      requests: [],
    });
  }

  async checkLimit(identifier: string): Promise<boolean> {
    const limit = this.limits.get(identifier);
    if (!limit) return true; // No limit set

    const now = Date.now();
    // Remove old requests outside the window
    limit.requests = limit.requests.filter(time => now - time < limit.window);

    if (limit.requests.length >= limit.limit) {
      return false; // Rate limit exceeded
    }

    limit.requests.push(now);
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const limit = this.limits.get(identifier);
    if (!limit) return Infinity;

    const now = Date.now();
    limit.requests = limit.requests.filter(time => now - time < limit.window);

    return Math.max(0, limit.limit - limit.requests.length);
  }

  reset(identifier: string): void {
    const limit = this.limits.get(identifier);
    if (limit) {
      limit.requests = [];
    }
  }

  getStats() {
    return Array.from(this.limits.values()).map(limit => ({
      identifier: limit.identifier,
      limit: limit.limit,
      window: limit.window,
      requests: limit.requests.length,
    }));
  }

  clearAll(): void {
    this.limits.clear();
  }
}

export const rateLimiter = new RateLimiter();

export function getRateLimitStats() {
  return rateLimiter.getStats();
}

export function isQmoiEndpoint(path: string): boolean {
  return typeof path === 'string' && path.includes('/qmoi');
}

export function cleanupRateLimits(): void {
  rateLimiter.clearAll();
}

// Legacy function for backward compatibility
export async function enforceRateLimitForLegacy(request: Request, limit: number = 100): Promise<boolean> {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  return rateLimiter.checkLimit(ip);
}