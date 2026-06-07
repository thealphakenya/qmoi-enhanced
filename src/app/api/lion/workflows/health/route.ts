/**
 * LION AGENT - Enhanced Workflow Health API Endpoint v2.0.0
 *
 * REST API for comprehensive system health monitoring
 * Includes workflow monitoring, API validation, domain validation, file validation, and QMOI consciousness
 * Master-only access for control operations
 *
 * Endpoints:
 * - GET  /api/lion/workflows/health - Get all workflow health status
 * - GET  /api/lion/workflows/health?workflow=<name> - Get specific workflow health
 * - GET  /api/lion/workflows/health?validations=true - Include validation systems
 * - PUT  /api/lion/workflows/health - Force validation refresh (master only)
 * - POST /api/lion/workflows/retry - Retry workflow (master only)
 * - GET  /api/lion/workflows/percentage - Get master health percentage
 * - GET  /api/lion/status - Get Lion Agent status
 *
 * Features:
 * - API endpoint validation
 * - Domain accessibility validation
 * - File integrity validation
 * - QMOI consciousness integration
 * - Error resilience and recovery
 * - Graceful degradation
 * - Fallback systems
 */


// Global Lion Agent instance
import { NextRequest, NextResponse } from 'next/server';
import { LionAgentWorkflowMonitor } from '@/services/lion-agent-workflows';
import { log as logger } from '@/lib/logger';
let lionAgent: LionAgentWorkflowMonitor | null = null;

/**
 * Initialize Lion Agent if not already initialized
 */
/**
 * initializeLionAgent function
 */
function initializeLionAgent(): LionAgentWorkflowMonitor {
  if (!lionAgent) {
    const token = process.env.GITHUB_TOKEN || '';
    lionAgent = new LionAgentWorkflowMonitor(token);
    lionAgent.startMonitoring().catch(err => {
      logger.error('🦁 Failed to start Lion Agent monitoring:', err);
    });
  }
  return lionAgent;
}

/**
 * Check if request is from master
 */
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
 * GET /api/lion/workflows/health
 * Get comprehensive health status including validations
 */
/**
 * GET function
 */
export async function GET(request: NextRequest): Promise<any> {
  try {
    const lionAgent = initializeLionAgent();
    const searchParams = request.nextUrl.searchParams;
    const workflow = searchParams.get('workflow');
    const incluPRODUCTIONalidations = searchParams.get('validations') === 'true';

    if (workflow) {
      // Get specific workflow health
      const health = lionAgent.getWorkflowHealth(workflow);

      if (!health) {
        return NextResponse.json(
          { error: `Workflow "${workflow}" not found` },
          { status: 404 }
        );
      }

      return NextResponse.json({
        workflow: health,
        timestamp: new Date().toISOString()
      });
    }

    // Get all workflow health
    const allHealth = lionAgent.getAllWorkflowHealth();
    const systemHealth = lionAgent.getSystemHealth();

    const response: any = {
      systemHealth,
      workflows: allHealth,
      count: allHealth.length,
      timestamp: new Date().toISOString()
    };

    // Include validation systems if requested
    if (incluPRODUCTIONalidations) {
      response.validations = {
        apis: Object.fromEntries(lionAgent.getAPIValidations()),
        domains: Object.fromEntries(lionAgent.getDomainValidations()),
        files: Object.fromEntries(lionAgent.getFileValidations()),
        qmoiConsciousness: lionAgent.getQMOIConsciousness()
      };
    }

    return NextResponse.json(response);

  } catch (error) {
    logger.error('🦁 Error in workflow health endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/lion/workflows/refresh
 * Force validation refresh (master only)
 */
/**
 * PUT function
 */
export async function PUT(request: NextRequest): Promise<any> {
  try {
    // Check master authorization
    if (!isMasterAuthorized(request)) {
      return NextResponse.json(
        { error: 'Unauthorized - Master token required' },
        { status: 401 }
      );
    }

    const lionAgent = initializeLionAgent();

    // Force validation refresh
    await lionAgent.forceValidationRefresh();

    return NextResponse.json({
      success: true,
      action: 'validation_refresh_completed',
      timestamp: new Date().toISOString(),
      message: 'All validation systems refreshed successfully'
    });

  } catch (error) {
    logger.error('🦁 Error in validation refresh:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handler for /api/lion/workflows/percentage
 * Get master health percentage
 */
export /**
 * getWorkflowHealthPercentage function
 */
function getWorkflowHealthPercentage(): number {
  const lionAgent = initializeLionAgent();
  const systemHealth = lionAgent.getSystemHealth();
  return systemHealth?.masterHealthPercentage || 0;
}

/**
 * Handler for /api/lion/status
 * Get Lion Agent status
 */
export /**
 * getLionAgentStatus function
 */
function getLionAgentStatus(): object {
  const lionAgent = initializeLionAgent();
  return lionAgent.getAgentStatus();
}

export default { GET, POST };
