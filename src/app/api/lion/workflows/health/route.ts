/**
 * LION AGENT - Workflow Health API Endpoint
 * 
 * REST API for real-time workflow health monitoring
 * Master-only access for control operations
 * 
 * Endpoints:
 * - GET  /api/lion/workflows/health - Get all workflow health status
 * - GET  /api/lion/workflows/health?workflow=<name> - Get specific workflow health
 * - GET  /api/lion/workflows/percentage - Get master health percentage
 * - POST /api/lion/workflows/retry - Retry workflow (master only)
 * - GET  /api/lion/status - Get Lion Agent status
 */

import { NextRequest, NextResponse } from 'next/server';
import LionAgentWorkflowMonitor from '@/services/lion-agent-workflows';

// Global Lion Agent instance
let lionAgent: LionAgentWorkflowMonitor | null = null;

/**
 * Initialize Lion Agent if not already initialized
 */
function initializeLionAgent(): LionAgentWorkflowMonitor {
  if (!lionAgent) {
    const token = process.env.GITHUB_TOKEN || '';
    lionAgent = new LionAgentWorkflowMonitor(token);
    lionAgent.startMonitoring().catch(err => {
      console.error('🦁 Failed to start Lion Agent monitoring:', err);
    });
  }
  return lionAgent;
}

/**
 * Check if request is from master
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
 * Get workflow health status
 */
export async function GET(request: NextRequest) {
  try {
    const lionAgent = initializeLionAgent();
    const searchParams = request.nextUrl.searchParams;
    const workflow = searchParams.get('workflow');

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

    return NextResponse.json({
      systemHealth,
      workflows: allHealth,
      count: allHealth.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('🦁 Error in workflow health endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/lion/workflows/retry
 * Retry a failed workflow (master only)
 */
export async function POST(request: NextRequest) {
  try {
    // Check master authorization
    if (!isMasterAuthorized(request)) {
      return NextResponse.json(
        { error: 'Unauthorized - Master token required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { workflow } = body;

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow name is required' },
        { status: 400 }
      );
    }

    const lionAgent = initializeLionAgent();
    
    // Execute retry
    await lionAgent.retryWorkflow(workflow, request.headers.get('authorization') || '');

    return NextResponse.json({
      success: true,
      workflow,
      action: 'retry_initiated',
      timestamp: new Date().toISOString(),
      message: `Retry initiated for workflow: ${workflow}`
    });

  } catch (error) {
    console.error('🦁 Error in workflow retry:', error);
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
export function getWorkflowHealthPercentage(): number {
  const lionAgent = initializeLionAgent();
  const systemHealth = lionAgent.getSystemHealth();
  return systemHealth?.masterHealthPercentage || 0;
}

/**
 * Handler for /api/lion/status
 * Get Lion Agent status
 */
export function getLionAgentStatus(): object {
  const lionAgent = initializeLionAgent();
  return lionAgent.getAgentStatus();
}

export default { GET, POST };
