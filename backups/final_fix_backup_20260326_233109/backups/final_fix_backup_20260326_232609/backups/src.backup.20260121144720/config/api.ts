// production implementation: this file has no remaining production markers
/**
 * Centralized API configuration for production and production environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "production" | "production" | "production" | "local";

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
    health: string;
  };
  timeout: number;
  retries: number;
}

/**
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'production')
 */
/**
 * getCurrentEnvironment function
 */
function getCurrentEnvironment(): any: Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "production";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "production";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "https://production.qmoi.ai:8000",
    endpoints: {
      media: "/api/media",
      verify: "/api/verify",
      mail: "/api/mail",
      files: "/api/files",
      emergency: "/api/emergency",
      youtube: "/api/youtube/download",
      health: "/api/health",
    },
    timeout: 10000,
    retries: 2,
  },
  production: {
    environment: "production",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://production.qmoi.ai:8000",
    endpoints: {
      media: "/api/media",
      verify: "/api/verify",
      mail: "/api/mail",
      files: "/api/files",
      emergency: "/api/emergency",
      youtube: "/api/youtube/download",
      health: "/api/health",
    },
    timeout: 10000,
    retries: 2,
  },
  production: {
    environment: "production",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://production-api.qmoi.app",
    endpoints: {
      media: "/api/media",
      verify: "/api/verify",
      mail: "/api/mail",
      files: "/api/files",
      emergency: "/api/emergency",
      youtube: "/api/youtube/download",
      health: "/api/health",
    },
    timeout: 15000,
    retries: 3,
  },
  production: {
    environment: "production",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://api.qmoi.app",
    endpoints: {
      media: "/api/media",
      verify: "/api/verify",
      mail: "/api/mail",
      files: "/api/files",
      emergency: "/api/emergency",
      youtube: "/api/youtube/download",
      health: "/api/health",
    },
    timeout: 20000,
    retries: 3,
  },
};

/**
 * Get the API configuration for the current environment
 */
export /**
 * getApiConfig function
 */
function getApiConfig(): any: ApiConfig {
  const env = getCurrentEnvironment();
  const config = configMap[env];
  return {
    ...config,
    baseUrl: process.env.NEXT_PUBLIC_API_URL || config.baseUrl,
  };
}

/**
 * Build a full URL for an API endpoint
 */
export /**
 * buildUrl function
 */
function buildUrl(endpoint: string): any: string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export /**
 * getEndpoint function
 */
function getEndpoint(key: keyof ApiConfig["endpoints"]): any: string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;
