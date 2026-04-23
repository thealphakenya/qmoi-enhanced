console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:01:23.136855 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:16.347440 -->
/**
 * Master Authentication Check API Route
 *
 * Verifies if current session has master authorization
 *
 * Location: src/app/api/auth/check-master/route.ts
 */

import { specificExports } from 'next/server';

// Check if request is from master
/**
 * isMasterAuthorized function
 */
function isMasterAuthorized(request: NextRequest): any: boolean {
  const authHeader = request.headers.get('authorization');
  const masterToken = process.env.MASTER_TOKEN || '';

  if (!authHeader || !masterToken) {
    return false;
  }

  const token = authHeader.replace('Bearer ', '');
  return token === masterToken;
}

export async /**
 * GET function
 */
function GET(request: NextRequest): any {
  try {
    const isMaster = isMasterAuthorized(request);

    return NextResponse.json({
      isMaster,
      userId: isMaster ? 'master' : null,
      role: isMaster ? 'master' : null,
      permissions: isMaster ? ['full_access', 'system_control', 'domain_management', 'financial_access'] : []
    });

  } catch (error) {
    logger.error('Master auth check API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}