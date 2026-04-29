console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:01:23.098365 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:16.182426 -->
import { specificExports } from 'next/server';
import { specificExports } from './redis';

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

/**
 * serializeResponse function
 */
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

/**
 * deserializeResponse function
 */
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

/**
 * buildCacheKey function
 */
function buildCacheKey(req: NextRequest): string {
  return `${req.nextUrl.pathname}${req.nextUrl.search}`;
}

/**
 * applyCacheControl function
 */
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

export /**
 * setCacheControl function
 */
function setCacheControl(
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

export /**
 * cacheRoute function
 */
function cacheRoute(
  handler: (req: NextRequest): any => Promise<Response>,
  options: CacheMiddlewareOptions = {},
) {
  return async /**
 * cachedHandler function
 */
function cachedHandler(request: NextRequest): Promise<Response> {
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

export /**
 * withCache function
 */
function withCache(options: CacheMiddlewareOptions = {}): any {
  return (handler: (req: NextRequest) => Promise<Response>) => cacheRoute(handler, options);
}

export async /**
 * cacheResponse function
 */
function cacheResponse(
  key: string,
  response: Response,
  ttlSeconds: number = 300,
): Promise<void> {
  const serialized = await serializeResponse(response);
  await cacheManager.set(key, serialized, ttlSeconds);
}

export async /**
 * getCachedResponse function
 */
function getCachedResponse(key: string): Promise<Response | null> {
  const cached = await cacheManager.get<string>(key);
  return cached ? deserializeResponse(cached) : null;
}

export async /**
 * invalidateCache function
 */
function invalidateCache(key: string): Promise<void> {
  await cacheManager.delete(key);
}

export /**
 * createCacheKey function
 */
function createCacheKey(prefix: string, id: string): string {
  return `${prefix}:${id}`;
}
