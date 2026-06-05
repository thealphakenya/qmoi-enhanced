import logger from '@/lib/logger';
import {
import { log as logger } from "@/lib/logger";
  exchangeOAuthCode,
  getOAuthRedirectUrl,
  isSocialProvider,
  type SocialProvider,
} from '@/lib/auth/social';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function GET(
  request: Request,
  { params }: { params: { provider: string } },
): Promise<Response> {
  const provider = params.provider as string;
  if (!isSocialProvider(provider)) {
    return jsonResponse({ error: 'Unsupported social provider' }, 400);
  }

  try {
    const url = new URL(request.url);
    const state = url.searchParams.get('state') || '';
    const redirectUrl = getOAuthRedirectUrl(provider as SocialProvider, state);

    logger.info(`Redirecting OAuth request for ${provider}`);
    return Response.redirect(redirectUrl);
  } catch (error) {
    logger.error('OAuth redirect failure', error instanceof Error ? error : String(error));
    return jsonResponse({ error: 'Failed to initiate OAuth redirect' }, 500);
  }
}

export async function POST(
  request: Request,
  { params }: { params: { provider: string } },
): Promise<Response> {
  const provider = params.provider as string;
  if (!isSocialProvider(provider)) {
    return jsonResponse({ error: 'Unsupported social provider' }, 400);
  }

  try {
    const body = await request.json();
    const code = typeof body?.code === 'string' ? body.code.trim() : '';
    if (!code) {
      return jsonResponse({ error: 'OAuth code is required' }, 400);
    }

    const tokenResponse = await exchangeOAuthCode(provider as SocialProvider, code);
    return jsonResponse({
      success: true,
      provider,
      token: tokenResponse.accessToken,
      refreshToken: tokenResponse.refreshToken,
      profile: tokenResponse.profile,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('OAuth token exchange failed', error instanceof Error ? error : String(error));
    return jsonResponse({ error: 'OAuth token exchange failed', details: error instanceof Error ? error.message : String(error) }, 500);
  }
}

