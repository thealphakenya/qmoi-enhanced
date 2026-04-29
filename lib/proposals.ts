export type ApiCheckResult = {
  ok: boolean;
  response?: { status?: number; body?: unknown };
};

type HeadersOrObject =
  | { get?: (key: string) => unknown }
  | Record<string, unknown>
  | null
  | undefined;

export function requireApiKey(headers: HeadersOrObject): ApiCheckResult {
  const get = (k: string) => {
    if (!headers) return undefined;
    if (typeof (headers as any).get === 'function') {
      return (headers as any).get(k);
    }
    const h = (headers as Record<string, any>) || {};
    return h[k] ?? h[k.toLowerCase()];
  };

  const key = get('x-api-key') || get('authorization') || get('Authorization');
  const master = process.env.MASTER_TOKEN || process.env.API_KEY || '';

  if (!master) {
    return {
      ok: false,
      response: { status: 401, body: { error: 'Unauthorized' } },
    };
  }

  if (!key) {
    return {
      ok: false,
      response: { status: 401, body: { error: 'Unauthorized' } },
    };
  }

  const normalized = String(key).replace(/^Bearer\s+/i, '').trim();
  if (normalized === master) {
    return { ok: true };
  }

  return {
    ok: false,
    response: { status: 401, body: { error: 'Unauthorized' } },
  };
}

export async function writeProposal(payload: unknown) {
  return { ok: true, payload };
}

export default { requireApiKey, writeProposal };
