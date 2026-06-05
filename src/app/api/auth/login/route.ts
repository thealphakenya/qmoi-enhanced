
import { NextRequest, NextResponse } from 'next/server';
import { authManager } from '@/auth/AuthManager';
import logger from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function sanitizeUser(user: any) {
  if (!user) return null;
  const { passwordHash, salt, ...rest } = user;
  return rest;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : typeof body?.password_hash === 'string' ? body.password_hash : '';
    const consciousnessSync = body?.consciousness_sync ?? false;

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required',
      }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email format',
      }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const session = await authManager.login(email, password, ip, userAgent);
    const user = await authManager.getUser(session.id);

    if (!user) {
      throw new Error('Failed to create authenticated session');
    }

    const responsePayload = {
      success: true,
      user: sanitizeUser(user),
      session: {
        token: session.token,
        expires_in: session.expiresAt - session.createdAt,
        expires_at: new Date(session.expiresAt).toISOString(),
        secure: true,
        http_only: true,
      },
      consciousness: {
        validated: Boolean(consciousnessSync),
        security_level: 'high',
        threat_detected: false,
      },
      timestamp: new Date().toISOString(),
    };

    const cookieHeader = `session_token=${session.token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${Math.floor((session.expiresAt - session.createdAt) / 1000)}`;

    return NextResponse.json(responsePayload, {
      status: 200,
      headers: {
        'Set-Cookie': cookieHeader,
      },
    });
  } catch (error) {
    logger.error('Login route failed', error instanceof Error ? error : { error });
    const message = error instanceof Error ? error.message : 'Authentication failed';
    const status = message === 'Invalid credentials' ? 401 : 500;
    return NextResponse.json({
      success: false,
      error: message,
    }, { status });
  }
}
