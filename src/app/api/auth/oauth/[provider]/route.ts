import { NextRequest, NextResponse } from 'next/server';
import {
  exchangeOAuthCode,
  getOAuthRedirectUrl,
  isSocialProvider,
  type SocialProvider,
} from '@/lib/auth/social';

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } },
) {
  const provider = params.provider as string;
  if (!isSocialProvider(provider)) {
    return NextResponse.json({ error: 'Unsupported social provider' }, { status: 400 });
  }

  const state = request.nextUrl.searchParams.get('state') || '';
  const redirectUrl = getOAuthRedirectUrl(provider as SocialProvider, state);

  return NextResponse.redirect(redirectUrl);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { provider: string } },
) {
  const provider = params.provider as string;
  if (!isSocialProvider(provider)) {
    return NextResponse.json({ error: 'Unsupported social provider' }, { status: 400 });
  }

  const body = await request.json();
  const code = body.code;
  if (!code) {
    return NextResponse.json({ error: 'OAuth code is required' }, { status: 400 });
  }

  const tokenResponse = await exchangeOAuthCode(provider as SocialProvider, code);
  return NextResponse.json({
    success: true,
    provider,
    token: tokenResponse.accessToken,
    refreshToken: tokenResponse.refreshToken,
    profile: tokenResponse.profile,
    timestamp: new Date().toISOString(),
  });
}
