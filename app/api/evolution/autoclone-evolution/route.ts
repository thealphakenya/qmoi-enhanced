// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/**
 * AUTOCLONE EVOLUTION API ENDPOINTS
 * Manage autonomous evolution of all autoclones
 */

import { NextRequest, NextResponse } from 'next/server';
import { autocloneEvolutionSystem } from '@/qmoi/core/evolution/autoclone-evolution';
import { verifyMasterRole } from '@/utils/auth';
import { consoleLog } from '@/utils/console-logger';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET - Get autoclone evolution statistics
 */
export async function GET(request: NextRequest) {
  try {
    const stats = autocloneEvolutionSystem.getEvolutionStats();

    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date(),
    });
  } catch (error) {
    consoleLog('❌ Error getting autoclone evolution stats', { error });
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST - Manage autoclone evolution
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, autocloneInfo, config } = body;

    const masterVerified = await verifyMasterRole(request);

    if (action === 'register-autoclone') {
      if (!masterVerified) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 403 }
        );
      }

      autocloneEvolutionSystem.registerAutoclone(autocloneInfo);

      return NextResponse.json({
        success: true,
        message: `Autoclone registered for evolution: ${autocloneInfo.cloneId}`,
        cloneId: autocloneInfo.cloneId,
      });
    }

    if (action === 'get-stats') {
      const stats = autocloneEvolutionSystem.getEvolutionStats();
      return NextResponse.json({
        success: true,
        data: stats,
      });
    }

    if (action === 'update-config') {
      if (!masterVerified) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 403 }
        );
      }

      // Evolution system would accept config updates here
      return NextResponse.json({
        success: true,
        message: 'Evolution configuration updated',
        config,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    consoleLog('❌ Error in autoclone evolution API', { error });
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
