export type SocialProvider = 'google' | 'github' | 'facebook';

interface ProviderConfig {
  authorizeUrl: string;
  tokenUrl: string;
  profileUrl: string;
  clientIdEnv: string;
  clientSecretEnv: string;
  scopes: string[];
  extraAuthParams?: Record<string, string>;
}

const PROVIDER_CONFIG: Record<SocialProvider, ProviderConfig> = {
  google: {
    authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    profileUrl: 'https://openidconnect.googleapis.com/v1/userinfo',
    clientIdEnv: 'GOOGLE_OAUTH_CLIENT_ID',
    clientSecretEnv: 'GOOGLE_OAUTH_CLIENT_SECRET',
    scopes: ['openid', 'email', 'profile'],
    extraAuthParams: {
      access_type: 'offline',
      prompt: 'consent',
    },
  },
  github: {
    authorizeUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    profileUrl: 'https://api.github.com/user',
    clientIdEnv: 'GITHUB_OAUTH_CLIENT_ID',
    clientSecretEnv: 'GITHUB_OAUTH_CLIENT_SECRET',
    scopes: ['read:user', 'user:email'],
    extraAuthParams: {
      allow_signup: 'true',
    },
  },
  facebook: {
    authorizeUrl: 'https://www.facebook.com/v13.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v13.0/oauth/access_token',
    profileUrl: 'https://graph.facebook.com/me',
    clientIdEnv: 'FACEBOOK_OAUTH_CLIENT_ID',
    clientSecretEnv: 'FACEBOOK_OAUTH_CLIENT_SECRET',
    scopes: ['email', 'public_profile'],
    extraAuthParams: {
      auth_type: 'rerequest',
    },
  },
};

function getEnvValue(key: string): string | undefined {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }

  return typeof globalThis !== 'undefined' && (globalThis as any).process?.env
    ? String((globalThis as any).process.env[key])
    : undefined;
}

function requireEnv(key: string): string {
  const value = getEnvValue(key);
  if (!value) {
    throw new Error(`Missing required environment variable ${key}`);
  }
  return value;
}

function generateRandomId(): string {
  if (typeof globalThis !== 'undefined' && (globalThis as any).crypto?.randomUUID) {
    return String((globalThis as any).crypto.randomUUID());
  }

  return `qmoi-${Math.floor(Math.random() * 1e16).toString(16)}`;
}

function isValidProvider(provider: string): provider is SocialProvider {
  return provider in PROVIDER_CONFIG;
}

export function isSocialProvider(provider: string): provider is SocialProvider {
  return isValidProvider(provider);
}

export function getOAuthRedirectUrl(provider: SocialProvider, state = ''): string {
  const config = PROVIDER_CONFIG[provider];
  const clientId = requireEnv(config.clientIdEnv);
  const baseUrl = getEnvValue('BASE_URL') || 'https://qmoi.ai';
  const redirectUri = `${baseUrl}/api/auth/oauth/${provider}/callback`;
  const scope = config.scopes.join(' ');
  const normalizedState = state || generateRandomId();

  const authParams = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope,
    state: normalizedState,
    ...config.extraAuthParams,
  } as Record<string, string>);

  return `${config.authorizeUrl}?${authParams.toString()}`;
}

interface OAuthTokenResult {
  accessToken: string;
  refreshToken?: string | null;
  expiresIn?: number;
  idToken?: string | null;
}

interface OAuthProfile {
  id: string;
  name: string;
  email?: string;
  provider: SocialProvider;
  raw: Record<string, unknown>;
}

async function fetchJson(url: string, init: RequestInit): Promise<any> {
  const response = await fetch(url, init);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`OAuth provider responded with ${response.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

async function fetchProfile(provider: SocialProvider, accessToken: string): Promise<OAuthProfile> {
  const config = PROVIDER_CONFIG[provider];
  const headers: HeadersInit = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json',
  };

  if (provider === 'github') {
    headers['User-Agent'] = 'qmoi-enhanced';
  }

  const url = new URL(config.profileUrl);
  if (provider === 'facebook') {
    url.searchParams.set('fields', 'id,name,email');
  }

  const profileData = await fetchJson(url.toString(), { headers });
  let email = (profileData.email as string) || undefined;

  if (provider === 'github' && !email) {
    const emails = await fetchJson('https://api.github.com/user/emails', { headers });
    if (Array.isArray(emails)) {
      const primaryEmail = emails.find((item: any) => item.primary && item.verified);
      email = primaryEmail?.email || emails[0]?.email;
    }
  }

  return {
    id: String(profileData.id || profileData.sub || profileData.node_id),
    name: String(profileData.name || profileData.login || profileData.email || 'Unknown User'),
    email,
    provider,
    raw: profileData,
  };
}

export async function exchangeOAuthCode(provider: SocialProvider, code: string): Promise<any> {
  if (!code) {
    throw new Error('OAuth code is required');
  }

  const config = PROVIDER_CONFIG[provider];
  const clientId = requireEnv(config.clientIdEnv);
  const clientSecret = requireEnv(config.clientSecretEnv);
  const baseUrl = getEnvValue('BASE_URL') || 'https://qmoi.ai';
  const redirectUri = `${baseUrl}/api/auth/oauth/${provider}/callback`;

  const tokenParams = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: redirectUri,
  });

  if (provider === 'google') {
    tokenParams.set('grant_type', 'authorization_code');
  }

  const tokenUrl = config.tokenUrl;
  const tokenResponse = await fetchJson(tokenUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: tokenParams.toString(),
  });

  const accessToken = tokenResponse.access_token as string;
  const refreshToken = (tokenResponse.refresh_token as string) || null;
  const expiresIn = typeof tokenResponse.expires_in === 'number' ? tokenResponse.expires_in : undefined;
  const idToken = (tokenResponse.id_token as string) || null;

  const profile = await fetchProfile(provider, accessToken);

  return {
    accessToken,
    refreshToken,
    expiresIn,
    idToken,
    providerUserId: profile.id,
    profile,
  };
}
