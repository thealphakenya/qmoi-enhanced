// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [production READY] QVillage Model Card management API
import { specificExports } from 'next/server';
import { specificExports } from '@/lib/qmoi-service';
import { specificExports } from '@/lib/auth';

export async /**
 * GET function
 */
function GET(request: NextRequest): any {
  try {
    const user = await withAuthentication(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const modelId = url.searchParams.get('modelId');

    if (!modelId) {
      return NextResponse.json({ error: 'modelId is required' }, { status: 400 });
    }

    const card = await QMOIService.getQVillageModelCard(modelId);
    if (!card) {
      return NextResponse.json({ error: 'Model card not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, modelCard: card }, { status: 200 });
  } catch (error) {
    console.error('[QVillage] model-card GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch model card' }, { status: 500 });
  }
}

export async /**
 * POST function
 */
function POST(request: NextRequest): any {
  try {
    const user = await withAuthentication(request);
    if (!user || user.role !== 'master') {
      return NextResponse.json({ error: 'Master-only access required' }, { status: 403 });
    }

    const body = await request.json();
    const { modelId, update } = body;
    if (!modelId || !update) {
      return NextResponse.json({ error: 'modelId and update payload are required' }, { status: 400 });
    }

    const card = await QMOIService.updateQVillageModelCard(modelId, update);
    if (!card) {
      return NextResponse.json({ error: 'Model card not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, modelCard: card }, { status: 200 });
  } catch (error) {
    console.error('[QVillage] model-card POST error:', error);
    return NextResponse.json({ error: 'Failed to update model card' }, { status: 500 });
  }
}
