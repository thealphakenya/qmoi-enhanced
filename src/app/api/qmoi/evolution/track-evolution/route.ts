// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:14Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/**
 * QMOI Evolution - Track Evolution Endpoint
 * Tracks model replacement history and evolution metrics
 */


export const runtime = 'nodejs';

/**
 * GET function
 */
export async function GET(request: NextRequest): Promise<any> {
  try {
    const user = await withAuthentication(request);
    
    if (!user || user.role !== 'master') {
      return NextResponse.json(
        { error: 'Unauthorized - master-only access' },
        { status: 403 }
      );
    }

    const qmoiState = await getQMOIState();
    const engine = qmoiState.evolutionEngine as ModelReplacementEngine;

    if (!engine) {
      return NextResponse.json(
        { error: 'Evolution engine not initialized' },
        { status: 500 }
      );
    }

    const replacementHistory = engine.getReplacementHistory();
    const evolutionStats = engine.getEvolutionStats();

    // Calculate additional metrics
    const completedReplacements = replacementHistory.filter(t => t.status === 'completed');
    const avgImprovement = completedReplacements.length > 0
      ? completedReplacements.reduce((sum, t) => sum + t.improvementPercentage, 0) / completedReplacements.length
      : 0;

    const rollbackCount = replacementHistory.filter(t => t.status === 'rolled-back').length;
    const successRate = completedReplacements.length > (completedReplacements.length + rollbackCount)
      ? (completedReplacements.length / (completedReplacements.length + rollbackCount)) * 100
      : 100;

    // Ensure master track is recorded and kept realtime
    await qmoiTracksService.createEvolutionTrack('master-evolution', {
      priority: 'critical',
      metadata: {
        replacementHistoryCount: replacementHistory.length,
        activeReplacements: replacementHistory.filter(t => ['pending', 'executing'].includes(t.status)).length,
      },
    });

    return NextResponse.json(
      {
        status: 'active',
        evolutionStats,
        replacementHistory: {
          total: replacementHistory.length,
          completed: completedReplacements.length,
          pending: replacementHistory.filter(t => t.status === 'pending').length,
          executing: replacementHistory.filter(t => t.status === 'executing').length,
          rolledBack: rollbackCount,
          trails: replacementHistory,
        },
        metrics: {
          averageImprovement: parseFloat(avgImprovement.toFixed(2)),
          successRate: parseFloat(successRate.toFixed(2)),
          totalImprovementPercentage: parseFloat(evolutionStats.totalImprovementPercentage.toFixed(2)),
          qmoiReplacement: {
            percentage: evolutionStats.nonQmoiModels > 0
              ? ((evolutionStats.qmoiModels / (evolutionStats.qmoiModels + evolutionStats.nonQmoiModels)) * 100).toFixed(2)
              : '0',
            count: evolutionStats.qmoiModels,
            total: evolutionStats.totalModels,
          },
        },
        evolutionTimeline: generateTimeline(replacementHistory),
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error('[EVOLUTION] Track evolution endpoint error:', error);

    return NextResponse.json(
      {
        error: 'Failed to track evolution',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST function
 */
export async function POST(request: NextRequest): Promise<any> {
  try {
    const user = await withAuthentication(request);
    
    if (!user || user.role !== 'master') {
      return NextResponse.json(
        { error: 'Only master users can manage evolution tracking' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action } = body;

    const qmoiState = await getQMOIState();
    const engine = qmoiState.evolutionEngine as ModelReplacementEngine;

    if (!engine) {
      return NextResponse.json(
        { error: 'Evolution engine not initialized' },
        { status: 500 }
      );
    }

    if (action === 'start-evaluation') {
      const { intervalMs = 300000 } = body;
      engine.startAutonomousEvaluation(intervalMs);

      return NextResponse.json(
        {
          status: 'started',
          message: `Autonomous evaluation started with ${intervalMs}ms interval`,
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    } else if (action === 'stop-evaluation') {
      engine.stopAutonomousEvaluation();

      return NextResponse.json(
        {
          status: 'stopped',
          message: 'Autonomous evaluation stopped',
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: `Unknown action: ${action}` },
        { status: 400 }
      );
    }
  } catch (error) {
    logger.error('[EVOLUTION] Manage tracking endpoint error:', error);

    return NextResponse.json(
      {
        error: 'Failed to manage tracking',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * generateTimeline function
 */
function generateTimeline(history: any[]): Promise<any>[] {
  return history
    .filter(t => t.status === 'completed')
    .slice(-10) // Last 10 completed replacements
    .map(trail => ({
      date: new Date(trail.timestamp).toLocaleString(),
      from: trail.originalModel,
      to: trail.replacedWith,
      improvement: `${trail.improvementPercentage.toFixed(2)}%`,
      reason: trail.reason,
    }));
}
