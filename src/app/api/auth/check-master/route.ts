import { NextRequest, NextResponse } from 'next/server';
import { log } from '@/lib/logger';

/**
 * Master Authentication Check API Route
 *
 * Verifies if current session has master authorization
 *
 * Location: src/app/api/auth/check-master/route.ts
 */


// Check if request is from master
/**
 * isMasterAuthorized function
 */
function isMasterAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const masterToken = process.env.MASTER_TOKEN || '';

  if (!authHeader || !masterToken) {
    return false;
  }

  const token = authHeader.replace('Bearer ', '');
  return token === masterToken;
}

/**
 * GET function
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const isMaster = isMasterAuthorized(request);

    return NextResponse.json({
      isMaster,
      userId: isMaster ? 'master' : null,
      role: isMaster ? 'master' : null,
      permissions: isMaster ? ['full_access', 'system_control', 'domain_management', 'financial_access'] : []
    });

  } catch (error) {
    const authError = error instanceof Error ? error : new Error(String(error));
    log.error('Master auth check API error:', authError);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
