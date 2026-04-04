/**
 * Authentication Middleware
 * Handles JWT token validation and user session management
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from './database-auth';
import { featureFlags } from './feature-flags';

export interface AuthContext {
  userId: string;
  token: string;
  isAuthenticated: boolean;
  isAdmin: boolean;
  metadata?: Record<string, any>;
}

/**
 * Extract and validate token from request
 */
export async function validateAuthToken(request: NextRequest): Promise<AuthContext> {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      userId: '',
      token: '',
      isAuthenticated: false,
      isAdmin: false,
    };
  }

  const token = authHeader.substring(7);

  try {
    const validation = await authService.validateToken(token);

    if (!validation.valid || !validation.userId) {
      return {
        userId: '',
        token: '',
        isAuthenticated: false,
        isAdmin: false,
      };
    }

    const user = await authService.getUser(validation.userId);

    if (!user) {
      return {
        userId: '',
        token: '',
        isAuthenticated: false,
        isAdmin: false,
      };
    }

    const isAdmin = user.metadata?.role === 'admin';

    return {
      userId: validation.userId,
      token,
      isAuthenticated: true,
      isAdmin,
      metadata: user.metadata,
    };
  } catch (error) {
    console.error('Token validation error:', error);
    return {
      userId: '',
      token: '',
      isAuthenticated: false,
      isAdmin: false,
    };
  }
}

/**
 * Verify user session (alias for validateAuthToken)
 */
export async function verifyUserSession(request: NextRequest): Promise<AuthContext> {
  return validateAuthToken(request);
}
export async function requireAuth(request: NextRequest): Promise<{ auth: AuthContext; error?: NextResponse }> {
  const auth = await validateAuthToken(request);

  if (!auth.isAuthenticated) {
    return {
      auth,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  return { auth };
}

/**
 * Require admin role middleware
 */
export async function requireAdmin(request: NextRequest): Promise<{ auth: AuthContext; error?: NextResponse }> {
  const auth = await validateAuthToken(request);

  if (!auth.isAuthenticated) {
    return {
      auth,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  if (!auth.isAdmin) {
    return {
      auth,
      error: NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 }),
    };
  }

  return { auth };
}

/**
 * Add auth context to response
 */
export function addAuthHeaders(response: NextResponse, auth: AuthContext): NextResponse {
  if (auth.isAuthenticated) {
    response.headers.set('X-User-ID', auth.userId);
    response.headers.set('X-Authenticated', 'true');
  }
  return response;
}

/**
 * Check feature access permissions
 */
export function canAccessFeature(auth: AuthContext, feature: string): boolean {
  // Only authenticated users can access authenticated features
  if (!auth.isAuthenticated) {
    return false;
  }

  // Admins have access to everything
  if (auth.isAdmin) {
    return true;
  }

  // Check user permissions
  const userPermissions = auth.metadata?.permissions || [];
  return userPermissions.includes(feature) || userPermissions.includes('*');
}

/**
 * Rate limit by user
 */
const rateLimits = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(userId: string, limit: number = 60, windowMs: number = 60000): boolean {
  const key = userId;
  const now = Date.now();

  let entry = rateLimits.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimits.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * Get rate limit info
 */
export function getRateLimitInfo(userId: string): { remaining: number; resetTime: number } {
  const entry = rateLimits.get(userId);

  if (!entry) {
    return {
      remaining: 60,
      resetTime: Date.now() + 60000,
    };
  }

  return {
    remaining: Math.max(0, 60 - entry.count),
    resetTime: entry.resetTime,
  };
}
