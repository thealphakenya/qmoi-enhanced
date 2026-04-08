import {
  exchangeOAuthCode,
  getOAuthRedirectUrl,
  isSocialProvider,
  type SocialProvider,
} from '@/lib/auth/social';

function jsonResponse(body: unknown, status = 200) {
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
) {
  const provider = params.provider as string;
  if (!isSocialProvider(provider)) {
    return jsonResponse({ error: 'Unsupported social provider' }, 400);
  }

  const url = new URL(request.url);
  const state = url.searchParams.get('state') || '';
  const redirectUrl = getOAuthRedirectUrl(provider as SocialProvider, state);

  return Response.redirect(redirectUrl);
}

export async function POST(
  request: Request,
  { params }: { params: { provider: string } },
) {
  const provider = params.provider as string;
  if (!isSocialProvider(provider)) {
    return jsonResponse({ error: 'Unsupported social provider' }, 400);
  }

  const body = await request.json();
  const code = (body as any).code;
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
}
