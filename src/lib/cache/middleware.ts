import { NextRequest } from 'next/server';
import { cacheManager } from './redis';

export interface CacheMiddlewareOptions {
  ttl?: number;
  keyGenerator?: (req: NextRequest) => string;
  condition?: (req: NextRequest) => boolean;
  onError?: (error: unknown) => void;
}

interface SerializedResponse {
  body: string;
  status: number;
  statusText: string;
  headers: [string, string][];
}

function serializeResponse(response: Response): Promise<string> {
  return response.text().then((body) =>
    JSON.stringify({
      body,
      status: response.status,
      statusText: response.statusText,
      headers: Array.from(response.headers.entries()),
    } as SerializedResponse),
  );
}

function deserializeResponse(value: string): Response {
  const serialized = JSON.parse(value) as SerializedResponse;
  const headers = new Headers(serialized.headers);
  headers.set('X-Cache', 'HIT');

  return new Response(serialized.body, {
    status: serialized.status,
    statusText: serialized.statusText,
    headers,
  });
}

function buildCacheKey(req: NextRequest): string {
  return `${req.nextUrl.pathname}${req.nextUrl.search}`;
}

function applyCacheControl(response: Response, ttlSeconds: number): Response {
  const headers = new Headers(response.headers);

  if (!headers.has('Cache-Control')) {
    headers.set('Cache-Control', `public, max-age=${ttlSeconds}, immutable`);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function setCacheControl(
  response: Response,
  options: {
    maxAge?: number;
    public?: boolean;
    mustRevalidate?: boolean;
    immutable?: boolean;
    staleWhileRevalidate?: number;
  } = {},
): Response {
  const directives: string[] = [];

  if (options.public ?? true) {
    directives.push('public');
  }
  if (typeof options.maxAge === 'number') {
    directives.push(`max-age=${options.maxAge}`);
  }
  if (options.mustRevalidate) {
    directives.push('must-revalidate');
  }
  if (options.immutable) {
    directives.push('immutable');
  }
  if (typeof options.staleWhileRevalidate === 'number') {
    directives.push(`stale-while-revalidate=${options.staleWhileRevalidate}`);
  }

  const headers = new Headers(response.headers);
  headers.set('Cache-Control', directives.join(', '));

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function cacheRoute(
  handler: (req: NextRequest) => Promise<Response>,
  options: CacheMiddlewareOptions = {},
) {
  return async function cachedHandler(request: NextRequest): Promise<Response> {
    try {
      if (request.method !== 'GET') {
        return await handler(request);
      }

      if (options.condition && !options.condition(request)) {
        return await handler(request);
      }

      const key = options.keyGenerator
        ? options.keyGenerator(request)
        : buildCacheKey(request);

      const cached = await cacheManager.get<string>(key);
      if (cached) {
        return deserializeResponse(cached);
      }

      const response = await handler(request);
      const serialized = await serializeResponse(response);
      await cacheManager.set(key, serialized, options.ttl ?? 300);

      const finalResponse = applyCacheControl(response, options.ttl ?? 300);
      return finalResponse;
    } catch (error) {
      if (options.onError) {
        options.onError(error);
      }
      return await handler(request);
    }
  };
}

export function withCache(options: CacheMiddlewareOptions = {}) {
  return (handler: (req: NextRequest) => Promise<Response>) => cacheRoute(handler, options);
}

export async function cacheResponse(
  key: string,
  response: Response,
  ttlSeconds: number = 300,
): Promise<void> {
  const serialized = await serializeResponse(response);
  await cacheManager.set(key, serialized, ttlSeconds);
}

export async function getCachedResponse(key: string): Promise<Response | null> {
  const cached = await cacheManager.get<string>(key);
  return cached ? deserializeResponse(cached) : null;
}

export async function invalidateCache(key: string): Promise<void> {
  await cacheManager.delete(key);
}

export function createCacheKey(prefix: string, id: string): string {
  return `${prefix}:${id}`;
}
