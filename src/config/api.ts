export type Environment = "local" | "staging" | "production";

export interface ApiConfig {
  environment: Environment;
  baseUrl: string;
  endpoints: {
    media: string;
    verify: string;
    mail: string;
    files: string;
    emergency: string;
    youtube: string;
    qstore: string;
    health: string;
  };
  timeoutMs: number;
  retries: number;
}

const DEFAULT_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:3000";

const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: DEFAULT_BASE_URL,
    endpoints: {
      media: "/api/media",
      verify: "/api/verify",
      mail: "/api/mail",
      files: "/api/files",
      emergency: "/api/emergency",
      youtube: "/api/youtube/download",
      qstore: "/api/qstore",
      health: "/api/health",
    },
    timeoutMs: 10000,
    retries: 1,
  },
  staging: {
    environment: "staging",
    baseUrl: DEFAULT_BASE_URL,
    endpoints: {
      media: "/api/media",
      verify: "/api/verify",
      mail: "/api/mail",
      files: "/api/files",
      emergency: "/api/emergency",
      youtube: "/api/youtube/download",
      qstore: "/api/qstore",
      health: "/api/health",
    },
    timeoutMs: 15000,
    retries: 2,
  },
  production: {
    environment: "production",
    baseUrl: DEFAULT_BASE_URL,
    endpoints: {
      media: "/api/media",
      verify: "/api/verify",
      mail: "/api/mail",
      files: "/api/files",
      emergency: "/api/emergency",
      youtube: "/api/youtube/download",
      qstore: "/api/qstore",
      health: "/api/health",
    },
    timeoutMs: 20000,
    retries: 3,
  },
};

export function getCurrentEnvironment(): Environment {
  const candidate = typeof window !== "undefined"
    ? ((window as unknown as Record<string, string | undefined>).__ENV || process.env.NEXT_PUBLIC_ENV)
    : process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV;

  if (candidate === "local") {
    return "local";
  }

  if (candidate === "staging") {
    return "staging";
  }

  return "production";
}

export function getApiConfig(): ApiConfig {
  return configMap[getCurrentEnvironment()];
}

export function buildUrl(endpoint: string): string {
  const apiConfig = getApiConfig();
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${apiConfig.baseUrl.replace(/\/+$/, "")}${normalizedEndpoint}`;
}

export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  return buildUrl(getApiConfig().endpoints[key]);
}

export default getApiConfig;
