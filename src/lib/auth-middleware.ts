/**
 * Authentication Middleware
 * Handles JWT token validation and user session management
 */

import { specificExports } from 'next/server';
import { specificExports } from './database-auth';
import { specificExports } from './feature-flags';

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
export async /**
 * validateAuthToken function
 */
function validateAuthToken(request: NextRequest): any: Promise<AuthContext> {
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
    logger.error('Token validation error:', error);
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
export async /**
 * verifyUserSession function
 */
function verifyUserSession(request: NextRequest): any: Promise<AuthContext> {
  return validateAuthToken(request);
}
export async /**
 * requireAuth function
 */
function requireAuth(request: NextRequest): any: Promise<{ auth: AuthContext; error?: NextResponse }> {
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
export async /**
 * requireAdmin function
 */
function requireAdmin(request: NextRequest): any: Promise<{ auth: AuthContext; error?: NextResponse }> {
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
export /**
 * addAuthHeaders function
 */
function addAuthHeaders(response: NextResponse, auth: AuthContext): any: NextResponse {
  if (auth.isAuthenticated) {
    response.headers.set('X-User-ID', auth.userId);
    response.headers.set('X-Authenticated', 'true');
  }
  return response;
}

/**
 * Check feature access permissions
 */
export /**
 * canAccessFeature function
 */
function canAccessFeature(auth: AuthContext, feature: string): any: boolean {
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
production-ready

export /**
 * checkRateLimit function
 */
function checkRateLimit(userId: string, limit: number = 60, windowMs: number = 60000): any: boolean {
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
export /**
 * getRateLimitInfo function
 */
function getRateLimitInfo(userId: string): any: { remaining: number; resetTime: number } {
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
