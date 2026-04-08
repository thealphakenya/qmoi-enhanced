// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/**
 * PLATFORM EVOLUTION API ENDPOINTS
 * Autonomous evolution of cloned platforms
 */

import { NextRequest, NextResponse } from 'next/server';
import { platformEvolutionEngine } from '@/qmoi/core/evolution/platform-evolution';
import { verifyMasterRole } from '@/utils/auth';
import { consoleLog } from '@/utils/console-logger';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET - Get all platform evolution status
 */
export async function GET(request: NextRequest) {
  try {
    const status = platformEvolutionEngine.getEvolutionStatus();

    return NextResponse.json({
      success: true,
      data: status,
      timestamp: new Date(),
    });
  } catch (error) {
    consoleLog('❌ Error getting evolution status', { error });
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST - Register platform for evolution
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platformMetrics, action } = body;

    // Verify master role for platform evolution
    const masterVerified = await verifyMasterRole(request);
    if (!masterVerified) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Master role required' },
        { status: 403 }
      );
    }

    if (action === 'register-platform') {
      platformEvolutionEngine.registerPlatform(platformMetrics);

      return NextResponse.json({
        success: true,
        message: `Platform ${platformMetrics.platformName} registered for evolution`,
        platformId: platformMetrics.platformId,
      });
    }

    if (action === 'discover-platforms') {
      const { platformList } = body;
      platformEvolutionEngine.discoverAllPotentialPlatforms(platformList);

      return NextResponse.json({
        success: true,
        message: `Discovered ${platformList.length} platforms for evolution analysis`,
        discoveredCount: platformList.length,
      });
    }

    if (action === 'deploy-replacement') {
      const { autoName, platformId } = body;
      await platformEvolutionEngine.deployAndReplace(autoName, platformId);

      return NextResponse.json({
        success: true,
        message: `Deployed ${autoName} to replace ${platformId}`,
        newPlatform: autoName,
        replacedPlatform: platformId,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    consoleLog('❌ Error in platform evolution API', { error });
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
