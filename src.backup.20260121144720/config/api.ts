/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/config/api.ts -->
/**
 * Centralized API configuration for production and development environments.
 * Adapters and components import from this file to get the correct base URL and endpoints.
 */

export type Environment = "development" | "staging" | "production" | "local";

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
 * Get the current environment (from NEXT_PUBLIC_ENV or default to 'development')
 */
function getCurrentEnvironment(): Environment {
  if (typeof window !== "undefined") {
    // Browser environment
    const env = (globalThis as unknown).__ENV__ || process.env.NEXT_PUBLIC_ENV;
    return (env as Environment) || "development";
  }
  // Server environment
  return (process.env.NEXT_PUBLIC_ENV as Environment) || "development";
}

/**
 * Configuration per environment
 */
const configMap: Record<Environment, ApiConfig> = {
  local: {
    environment: "local",
    baseUrl: "http://localhost:8000",
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
  development: {
    environment: "development",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
  staging: {
    environment: "staging",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://staging-api.qmoi.app",
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
export function getApiConfig(): ApiConfig {
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
export function buildUrl(endpoint: string): string {
  const config = getApiConfig();
  return `${config.baseUrl}${endpoint}`;
}

/**
 * Get a specific endpoint URL
 */
export function getEndpoint(key: keyof ApiConfig["endpoints"]): string {
  const config = getApiConfig();
  return buildUrl(config.endpoints[key]);
}

export default getApiConfig;
