export type FetchResult<T = any> = {
  ok: boolean;
  status: number;
  data?: T;
  text?: string;
};

export async function parseFetchResponse<T = any>(res: any): Promise<FetchResult<T>> {
  if (!res) return { ok: false, status: 0, text: 'no response' };
  const status = res.status || 0;
  let data: T | undefined;
  try {
    if (res && typeof res.json === 'function') {
      data = await res.json();
      return { ok: !!res.ok, status, data };
    }
    if (res && typeof res.text === 'function') {
      const t = await res.text();
      return { ok: !!res.ok, status, text: t };
    }
    return { ok: !!res.ok, status, text: String(res) };
  } catch (e) {
    return { ok: !!res.ok, status, text: String(e) };
  }
}

export async function fetchWithRetry(url: string, init: any = {}, attempts = 3, delayMs = 300): Promise<FetchResult> {
  let lastErr: any;
  for (let i = 0; i < attempts; i++) {
    try {
      const nodeFetch = await import('node-fetch');
      const fetch = (nodeFetch as any).default || (nodeFetch as any);
      const res = await fetch(url, init);
      return await parseFetchResponse(res);
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
  return { ok: false, status: 0, text: String(lastErr) };
}

export default fetchWithRetry;
