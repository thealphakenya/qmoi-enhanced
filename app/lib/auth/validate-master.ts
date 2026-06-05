import { NextRequest } from 'next/server';

/**
 * Validate Master Authentication for Global Operations
 * Checks Bearer token against master credentials
 */
export async function validateMasterAuth(request: NextRequest) {
  try {
    // Extract Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        authenticated: false,
        error: 'Missing or invalid Authorization header',
      };
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Validate token against master token
    const masterToken = process.env.NEXT_PUBLIC_MASTER_TOKEN || 
                       process.env.MASTER_TOKEN ||
                       process.env.QM_MASTER_TOKEN;

    if (!masterToken) {
      console.error('[Auth] No master token configured');
      return {
        authenticated: false,
        error: 'Server configuration error',
      };
    }

    // Timing-safe comparison to prevent timing attacks
    const isValid = timingSafeEqual(token, masterToken);

    if (!isValid) {
      return {
        authenticated: false,
        error: 'Invalid master token',
        masterId: 'unknown',
      };
    }

    // Extract master ID from request if available
    const masterId = request.headers.get('X-Master-ID') || 'system';

    return {
      authenticated: true,
      token,
      masterId,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[Auth] Validation error:', error);
    return {
      authenticated: false,
      error: 'Authentication validation failed',
    };
  }
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Extract and validate bearer token from request
 */
export function extractBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.substring(7);
}

/**
 * Check if request has valid master authentication
 * Used as middleware guard
 */
export async function requireMasterAuth(request: NextRequest) {
  const validation = await validateMasterAuth(request);
  return validation.authenticated;
}
