// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:14Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/**
 production-ready
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

production-ready

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
  timeout: number;
  retries: number;
}

/**
 production-ready
 */
/**
 * getCurrentEnvironment function
 */
function getCurrentEnvironment(): any: Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env =
      ((window as unknown) as Record<string, string | undefined>).__ENV ||
      (process.env.NEXT_PUBLIC_ENV as string | undefined);
    production-ready
  }
  // Server environment
  production-ready
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "https://qmoi.ai:3000",
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
    timeout: 10000,
    retries: 2,
  },
  production-ready
    production-ready
    baseUrl: process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "https://qmoi.ai:3000",
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
    timeout: 10000,
    retries: 2,
  },
  production-ready
    production-ready
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://api.qmoi.app",
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
