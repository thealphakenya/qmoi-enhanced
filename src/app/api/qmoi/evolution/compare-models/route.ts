// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:14Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/**
 * QMOI Evolution - Compare Models Endpoint
 * Compares performance metrics between models
 */


export const runtime = 'nodejs';

/**
 * POST function
 */
export async function POST(request: NextRequest): Promise<any> {
  try {
    const user = await withAuthentication(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { modelIds = [] } = body;

    if (!Array.isArray(modelIds) || modelIds.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 model IDs required for comparison' },
        { status: 400 }
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

    const allModels = engine.getModels();
    const modelsToCompare = allModels.filter(m => modelIds.includes(m.modelId));

    if (modelsToCompare.length < 2) {
      return NextResponse.json(
        { error: 'Could not find enough models for comparison' },
        { status: 404 }
      );
    }

    // Calculate comparison metrics
    const comparison = {
      models: modelsToCompare,
      analysis: {
        bestAccuracy: Math.max(modelsToCompare.map(m => m.accuracy)),
        bestSpeed: Math.max(modelsToCompare.map(m => m.speed)),
        bestReliability: Math.max(modelsToCompare.map(m => m.reliability)),
        lowestResourceUsage: Math.min(modelsToCompare.map(m => m.resourceUsage)),
        rankings: {
          byAccuracy: modelsToCompare
            .sort((a, b) => b.accuracy - a.accuracy)
            .map(m => ({ modelId: m.modelId, modelName: m.modelName, accuracy: m.accuracy })),
          bySpeed: modelsToCompare
            .sort((a, b) => b.speed - a.speed)
            .map(m => ({ modelId: m.modelId, modelName: m.modelName, speed: m.speed })),
          byReliability: modelsToCompare
            .sort((a, b) => b.reliability - a.reliability)
            .map(m => ({ modelId: m.modelId, modelName: m.modelName, reliability: m.reliability })),
          byResourceEfficiency: modelsToCompare
            .sort((a, b) => a.resourceUsage - b.resourceUsage)
            .map(m => ({ modelId: m.modelId, modelName: m.modelName, resourceUsage: m.resourceUsage })),
        },
        recommendations: generateRecommendations(modelsToCompare),
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(comparison, { status: 200 });
  } catch (error) {
    logger.error('[EVOLUTION] Compare models endpoint error:', error);

    return NextResponse.json(
      {
        error: 'Failed to compare models',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET function
 */
export async function GET(request: NextRequest): Promise<any> {
  try {
    const user = await withAuthentication(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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

    const models = engine.getModels();
    
    return NextResponse.json(
      {
        status: 'active',
        
          modelId: m.modelId,
          modelName: m.modelName,
          isQMOI: m.isQMOI,
        })),
        totalModels: models.length,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error('[EVOLUTION] Get models endpoint error:', error);

    return NextResponse.json(
      {
        error: 'Failed to retrieve models',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * generateRecommendations function
 */
function generateRecommendations(models: any[]): string[] {
  const recommendations: string[] = [];
  
  const qmoiModels = models.filter(m => m.isQMOI);
  const nonQmoiModels = models.filter(m => !m.isQMOI);

  if (qmoiModels.length > 0 && nonQmoiModels.length > 0) {
    const avgQmoiAccuracy = qmoiModels.reduce((sum, m) => sum + m.accuracy, 0) / qmoiModels.length;
    const avgNonQmoiAccuracy = nonQmoiModels.reduce((sum, m) => sum + m.accuracy, 0) / nonQmoiModels.length;

    if (avgQmoiAccuracy > avgNonQmoiAccuracy) {
      recommendations.push(
        `QMOI models show ${(((avgQmoiAccuracy - avgNonQmoiAccuracy) / avgNonQmoiAccuracy * 100).toFixed(2))}% higher accuracy on average`
      );
      recommendations.push('Consider replacing underperforming models with QMOI variants');
    }
  }

  const bestModel = models.reduce((best, current) => 
    ((current.accuracy + current.reliability) / 2) > ((best.accuracy + best.reliability) / 2) 
      ? current 
      : best
  );

  recommendations.push(
    `${bestModel.modelName} shows best overall performance (${(bestModel.accuracy).toFixed(2)}% accuracy)`
  );

  return recommendations;
}
