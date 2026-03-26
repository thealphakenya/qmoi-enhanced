// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:12Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // Production implementation: Global financial operations route for QMOI
import { NextResponse } from 'next/server';
import { qmoiRevenueEnhancementService } from '../../../../../../lib/qmoi/revenue_enhancement_service';
import { headers } from 'next/headers';

async function verifyMasterAccess(request: Request) {
  const headersList = await headers();
  const token = headersList.get('authorization')?.replace('Bearer ', '');
  if (!token || token !== process.env.ADMIN_TOKEN) return false;
  return true;
}

export async function GET(request: Request) {
  if (!(await verifyMasterAccess(request))) {
    return NextResponse.json({ error: 'Unauthorized: Master access required' }, { status: 403 });
  }

  const stats = await qmoiRevenueEnhancementService.refreshRealtimeStats();
  return NextResponse.json({ success: true, data: stats, timestamp: new Date().toISOString() });
}

export async function POST(request: Request) {
  if (!(await verifyMasterAccess(request))) {
    return NextResponse.json({ error: 'Unauthorized: Master access required' }, { status: 403 });
  }

  const body = await request.json();
  const action = body.action || 'sync';

  try {
    if (action === 'sync') {
      const result = await qmoiRevenueEnhancementService.syncAutoProjects();
      return NextResponse.json({ success: true, action: 'sync', result });
    }

    if (action === 'createProject') {
      const project = await qmoiRevenueEnhancementService.createAutoProject(body.project);
      return NextResponse.json({ success: true, action: 'createProject', project });
    }

    if (action === 'confirmTransaction') {
      const tx = await qmoiRevenueEnhancementService.confirmTransaction(body.platform, body.transactionId, body.expectedAmount);
      return NextResponse.json({ success: true, action: 'confirmTransaction', result: tx });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Action failed', details: error instanceof Error ? error.message : 'Unknown' }, { status: 500 });
  }
}
