export type SocialProvider = 'google' | 'github' | 'facebook';

const PROVIDER_CONFIG: Record<SocialProvider, { authorizeUrl: string; clientIdEnv: string; scopes: string[] }> = {
  google: {
    authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    clientIdEnv: 'GOOGLE_OAUTH_CLIENT_ID',
    scopes: ['openid', 'email', 'profile'],
  },
  github: {
    authorizeUrl: 'https://github.com/login/oauth/authorize',
    clientIdEnv: 'GITHUB_OAUTH_CLIENT_ID',
    scopes: ['read:user', 'user:email'],
  },
  facebook: {
    authorizeUrl: 'https://www.facebook.com/v13.0/dialog/oauth',
    clientIdEnv: 'FACEBOOK_OAUTH_CLIENT_ID',
    scopes: ['email', 'public_profile'],
  },
};

/**
 * getEnvValue function
 */
function getEnvValue(key: string): string | undefined {
  return typeof globalThis !== 'undefined' && (globalThis as any).process?.env
    ? String((globalThis as any).process.env[key])
    : undefined;
}

/**
 * generateRandomId function
 */
function generateRandomId(): string {
  if (typeof globalThis !== 'undefined' && (globalThis as any).crypto?.randomUUID) {
    return String((globalThis as any).crypto.randomUUID());
  }

  return `qmoi-${Math.floor(Math.random() * 1e16).toString(16)}`;
}

/**
 * hashString function
 */
function hashString(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

/**
 * createRandomToken function
 */
function createRandomToken(length = 64): string {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < length; i += 1) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}

export /**
 * isSocialProvider function
 */
function isSocialProvider(provider: string): provider is SocialProvider {
  return Object.keys(PROVIDER_CONFIG).includes(provider);
}

export /**
 * getOAuthRedirectUrl function
 */
function getOAuthRedirectUrl(provider: SocialProvider, state = ''): string {
  const config = PROVIDER_CONFIG[provider];
  const clientId = getEnvValue(config.clientIdEnv) || `default-${provider}-client-id`;
  const baseUrl = getEnvValue('BASE_URL') || 'https://qmoi.ai';
  const redirectUri = `${baseUrl}/api/auth/oauth/${provider}/callback`;
  const scope = encodeURIComponent(config.scopes.join(' '));
  const encodedState = encodeURIComponent(state || generateRandomId());

  return `${config.authorizeUrl}?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(
    redirectUri,
  )}&response_type=code&scope=${scope}&state=${encodedState}`;
}

/**
 * exchangeOAuthCode function
 */
export async function exchangeOAuthCode(provider: SocialProvider, code: string): any {
  const accessToken = createRandomToken(64);
  const refreshToken = createRandomToken(64);
  const providerUserId = `${provider}-${hashString(code).slice(0, 16)}`;

  return {
    accessToken,
    refreshToken,
    providerUserId,
    profile: {
      id: providerUserId,
      name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      email: `${providerUserId}@qmoi-ai.io`,
      provider,
    },
  };
}
