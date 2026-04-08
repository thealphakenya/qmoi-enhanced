/**
 * Master Domain Health Refresh API Route
 *
 * Forces refresh of domain validation data
 * Master-only access required
 *
 * Location: src/app/api/master/domain-health/refresh/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { LionAgentWorkflowMonitor } from '@/services/lion-agent-workflows';

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

export async function POST(request: NextRequest) {
  try {
    // Check master authorization
    if (!isMasterAuthorized(request)) {
      return NextResponse.json(
        { error: 'Unauthorized - Master token required' },
        { status: 401 }
      );
    }

    console.log('🦁 Master: Forcing domain validation refresh...');

    // Force domain validation refresh
    const lionAgent = new LionAgentWorkflowMonitor();
    await lionAgent.forceValidationRefresh();

    // Get updated domain data
    const domainValidations = lionAgent.getDomainValidations();
    const validations = Array.from(domainValidations.values());
    const healthyDomains = validations.filter(v => v.health >= 80).length;
    const totalDomains = validations.length;
    const healthPercentage = totalDomains > 0 ? (healthyDomains / totalDomains) * 100 : 0;

    const stats = {
      totalDomains,
      healthyDomains,
      healthPercentage,
      lastValidated: new Date().toISOString(),
      allHealthy: healthyDomains === totalDomains
    };

    console.log(`🦁 Master: Domain validation refresh completed - ${healthyDomains}/${totalDomains} domains healthy`);

    return NextResponse.json({
      success: true,
      message: 'Domain validation refresh completed',
      validations,
      stats
    });

  } catch (error) {
    console.error('Domain health refresh API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}