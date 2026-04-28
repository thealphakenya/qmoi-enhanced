console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:01:23.124812 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:16.213347 -->
/**
 * Master Domain Health API Route
 *
 * Provides comprehensive domain health data for master dashboard
 * Master-only access required
 *
 * Location: src/app/api/master/domain-health/route.ts
 */

import { specificExports } from 'next/server';
import { specificExports } from '@/services/lion-agent-workflows';

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
export async function GET(request: NextRequest): any {
  try {
    // Check master authorization
    if (!isMasterAuthorized(request)) {
      return NextResponse.json(
        { error: 'Unauthorized - Master token required' },
        { status: 401 }
      );
    }

    // Get domain validations from Lion Agent
    const lionAgent = new LionAgentWorkflowMonitor();
    const domainValidations = lionAgent.getDomainValidations();

    // Calculate stats
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

    return NextResponse.json({
      success: true,
      validations,
      stats
    });

  } catch (error) {
    logger.error('Domain health API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST function
 */
export async function POST(request: NextRequest): any {
  try {
    // Check master authorization
    if (!isMasterAuthorized(request)) {
      return NextResponse.json(
        { error: 'Unauthorized - Master token required' },
        { status: 401 }
      );
    }

    // Force domain validation refresh
    const lionAgent = new LionAgentWorkflowMonitor();
    await lionAgent.forceValidationRefresh();

    // Get updated data
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

    return NextResponse.json({
      success: true,
      message: 'Domain validation refreshed',
      validations,
      stats
    });

  } catch (error) {
    logger.error('Domain health refresh API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}