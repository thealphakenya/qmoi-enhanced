/**
 * Master Authentication Check API Route
 *
 * Verifies if current session has master authorization
 *
 * Location: src/app/api/auth/check-master/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';

// Check if request is from master
function isMasterAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const masterToken = process.env.MASTER_TOKEN || '';

  if (!authHeader || !masterToken) {
    return false;
  }

  const token = authHeader.replace('Bearer ', '');
  return token === masterToken;
}

export async function GET(request: NextRequest) {
  try {
    const isMaster = isMasterAuthorized(request);

    return NextResponse.json({
      isMaster,
      userId: isMaster ? 'master' : null,
      role: isMaster ? 'master' : null,
      permissions: isMaster ? ['full_access', 'system_control', 'domain_management', 'financial_access'] : []
    });

  } catch (error) {
    console.error('Master auth check API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}