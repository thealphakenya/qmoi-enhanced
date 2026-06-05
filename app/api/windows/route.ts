import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { log, logApiError } from '../../../src/lib/logger';
import { log as logger } from "@/lib/logger";

const REDIS_KEY = 'qmoi:windows';
const DATA_FILE = path.join(process.cwd(), 'data', 'windows.json');

async function createStore() {
  // Try Redis first (recommended). If Redis client is not installed or REDIS_URL
  // is not set/connection fails, gracefully fall back to a simple file-backed store.
  try {
    const redisModule: any = await import('redis');
    const { createClient } = redisModule;
    const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
    const client = createClient({ url: redisUrl });
    client.on('error', (err: any) => log.error('Redis client error', err));
    await client.connect();

    return {
      async get() {
        const raw = await client.get(REDIS_KEY);
        if (!raw) return [];
        try {
          return JSON.parse(raw);
        } catch (err) {
          log.warn('Failed to parse windows JSON from Redis', { raw });
          return [];
        }
      },
      async set(value: any) {
        await client.set(REDIS_KEY, JSON.stringify(value));
      },
    };
  } catch (err) {
    log.warn('Redis unavailable; falling back to file-backed windows store');

    // Ensure data directory exists when using file fallback
    const ensureDir = async () => {
      const dir = path.dirname(DATA_FILE);
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (_) {
        // ignore
      }
    };

    return {
      async get() {
        try {
          await ensureDir();
          const raw = await fs.readFile(DATA_FILE, 'utf-8');
          return JSON.parse(raw || '[]');
        } catch (e) {
          return [];
        }
      },
      async set(value: any) {
        try {
          await ensureDir();
          await fs.writeFile(DATA_FILE, JSON.stringify(value, null, 2), 'utf-8');
        } catch (e) {
          if (e instanceof Error) {
            log.error('Failed to write windows file store', e);
          } else {
            log.error('Failed to write windows file store', { error: String(e) });
          }
        }
      },
    };
  }
}

export async function GET(_req: NextRequest) {
  const start = Date.now();
  try {
    const store = await createStore();
    const windows = await store.get();
    const duration = Date.now() - start;
    log.info('GET /api/windows', { count: Array.isArray(windows) ? windows.length : 0, duration });
    return NextResponse.json(windows);
  } catch (err) {
    logApiError('GET', '/api/windows', err as Error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const start = Date.now();
  try {
    const payload = await req.json();
    const store = await createStore();
    await store.set(payload);
    const duration = Date.now() - start;
    log.info('POST /api/windows', { saved: true, duration });
    return NextResponse.json({ ok: true });
  } catch (err) {
    logApiError('POST', '/api/windows', err as Error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
