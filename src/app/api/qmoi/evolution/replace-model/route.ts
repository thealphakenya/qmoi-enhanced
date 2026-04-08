// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:14Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/**
 * QMOI Evolution - Replace Model Endpoint
 * Handles autonomous and manual model replacement requests
 production-ready
 */

import { specificExports } from 'next/server';
import { specificExports } from '@/qmoi/core/evolution/model-replacement';
import { specificExports } from '@/lib/auth';
import { specificExports } from '@/lib/qmoi-state';

export const runtime = 'nodejs';

export async /**
 * POST function
 */
function POST(request: NextRequest): any {
  try {
    // Verify master-only access for autonomous replacements
    const user = await withAuthentication(request);
    
    if (!user || user.role !== 'master') {
      return NextResponse.json(
        { error: 'Only master users can execute model replacements' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { currentModelId, candidateModelId, autonomous = false } = body;

    if (!currentModelId || !candidateModelId) {
      return NextResponse.json(
        { error: 'currentModelId and candidateModelId are required' },
        { status: 400 }
      );
    }

    // Get QMOI state with evolution engine
    const qmoiState = await getQMOIState();
    const engine = qmoiState.evolutionEngine as ModelReplacementEngine;

    if (!engine) {
      return NextResponse.json(
        { error: 'Evolution engine not initialized' },
        { status: 500 }
      );
    }

    // Make replacement decision
    const decision: ReplacementDecision = await engine.decideReplacement(
      currentModelId,
      candidateModelId
    );

    // For autonomous decisions, execute immediately if confidence is high
    if (autonomous && decision.confidence > 0.8) {
      const success = await engine.executeReplacement(decision);

      return NextResponse.json(
        {
          decision,
          executed: success,
          status: success ? 'replaced' : 'failed',
          message: success
            ? `Model replaced successfully with ${decision.improvementPercentage.toFixed(2)}% improvement`
            : 'Model replacement execution failed - rolled back',
          timestamp: new Date().toISOString(),
          evolutionStats: engine.getEvolutionStats(),
        },
        { status: success ? 200 : 500 }
      );
    }

    // For non-autonomous, return decision for review
    return NextResponse.json(
      {
        decision,
        requiresReview: !autonomous,
        status: 'pending-decision',
        message: decision.shouldReplace
          ? `Ready to replace ${decision.currentModel.modelName} with ${decision.replacementModel.modelName}`
          : 'Replacement not required at this time',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[EVOLUTION] Replace model endpoint error:', error);

    return NextResponse.json(
      {
        error: 'Failed to process model replacement',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async /**
 * GET function
 */
function GET(request: NextRequest): any {
  try {
    const user = await withAuthentication(request);
    
    if (!user || user.role !== 'master') {
      return NextResponse.json(
        { error: 'Unauthorized' },
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

    return NextResponse.json(
      {
        status: 'active',
        models: engine.getModels(),
        replacementHistory: engine.getReplacementHistory(),
        evolutionStats: engine.getEvolutionStats(),
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[EVOLUTION] Get endpoint error:', error);

    return NextResponse.json(
      {
        error: 'Failed to retrieve evolution data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
