/**
 * Production-ready API client wrapper.
 */

export type ApiClientOptions = RequestInit & {
  timeoutMs?: number;
  retry?: number;
  baseUrl?: string;
};

const DEFAULT_TIMEOUT_MS = 25000;
const DEFAULT_RETRY = 1;

const isAbsoluteUrl = (value: string): boolean => /^https?:\/\//i.test(value);

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    const windowEnv = window as unknown as Record<string, string | undefined>;
    const envBaseUrl =
      windowEnv.NEXT_PUBLIC_API_URL ||
      windowEnv.__ENV ||
      process.env.NEXT_PUBLIC_API_URL;

    if (envBaseUrl) {
      return envBaseUrl;
    }

    return window.location.origin;
  }

  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "http://localhost:3000"
  );
}

function normalizeHeaders(headers?: HeadersInit): Record<string, string> {
  const normalized: Record<string, string> = {};

  if (!headers) {
    return normalized;
  }

  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      normalized[key.toLowerCase()] = value;
    });
  } else if (Array.isArray(headers)) {
    headers.forEach(([key, value]) => {
      normalized[key.toLowerCase()] = value;
    });
  } else {
    Object.entries(headers).forEach(([key, value]) => {
      if (typeof value === "string") {
        normalized[key.toLowerCase()] = value;
      }
    });
  }

  return normalized;
}

function resolveRequestUrl(endpoint: string, baseUrl?: string): string {
  if (isAbsoluteUrl(endpoint)) {
    return endpoint;
  }

  const urlBase = (baseUrl ?? getBaseUrl()).replace(/\/+$/, "");
  if (endpoint.startsWith("/")) {
    return `${urlBase}${endpoint}`;
  }

  return `${urlBase}/${endpoint}`;
}

function normalizeRequestInit(options: ApiClientOptions): RequestInit {
  const headers = normalizeHeaders(options.headers);

  if (!headers.accept) {
    headers.accept = "application/json";
  }

  let body: BodyInit | null | undefined = options.body;
  const isJsonBody =
    body != null &&
    typeof body === "object" &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    !(body instanceof Blob);

  if (isJsonBody) {
    if (!headers["content-type"]) {
      headers["content-type"] = "application/json";
    }
    body = JSON.stringify(body);
  }

  const { timeoutMs, retry, baseUrl, ...fetchOptions } = options;

  return {
    ...fetchOptions,
    headers,
    body,
  };
}

async function fetchWithTimeout(
  url: string,
  options: ApiClientOptions,
): Promise<Response> {
  const requestUrl = resolveRequestUrl(url, options.baseUrl);
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const externalSignal = options.signal;
  const signal = externalSignal ?? controller.signal;
  const init = normalizeRequestInit({ ...options, signal });

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  if (!externalSignal) {
    timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  }

  try {
    return await fetch(requestUrl, init);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

function shouldRetry(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.name === "AbortError" ||
    error.message.includes("Failed to fetch") ||
    error.message.toLowerCase().includes("network")
  );
}

async function request(
  url: string,
  options: ApiClientOptions = {},
): Promise<Response> {
  const maxRetries = options.retry ?? DEFAULT_RETRY;
  let attempt = 0;
  let lastError: unknown;

  while (attempt <= maxRetries) {
    try {
      const response = await fetchWithTimeout(url, options);
      if (!response.ok) {
        const body = await response.text().catch(() => "");
        const error = new Error(
          `Request failed: ${response.status} ${response.statusText}${
            body ? ` - ${body}` : ""
          }`,
        );
        Object.assign(error, { status: response.status, url });
        throw error;
      }
      return response;
    } catch (error) {
      lastError = error;
      if (attempt >= maxRetries || !shouldRetry(error)) {
        throw error;
      }
      const backoff = 300 * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, backoff));
      attempt += 1;
    }
  }

  throw lastError;
}

async function parseJson<T>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}

function get(url: string, options: ApiClientOptions = {}): Promise<Response> {
  return request(url, { ...options, method: "GET" });
}

function post(
  url: string,
  body?: unknown,
  options: ApiClientOptions = {},
): Promise<Response> {
  return request(url, { ...options, method: "POST", body });
}

function put(
  url: string,
  body?: unknown,
  options: ApiClientOptions = {},
): Promise<Response> {
  return request(url, { ...options, method: "PUT", body });
}

function patch(
  url: string,
  body?: unknown,
  options: ApiClientOptions = {},
): Promise<Response> {
  return request(url, { ...options, method: "PATCH", body });
}

function del(url: string, options: ApiClientOptions = {}): Promise<Response> {
  return request(url, { ...options, method: "DELETE" });
}

async function json<T>(
  url: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const response = await request(url, options);
  return parseJson<T>(response);
}

const apiClient = {
  request,
  get,
  post,
  put,
  patch,
  delete: del,
  json,
};

export default apiClient;
