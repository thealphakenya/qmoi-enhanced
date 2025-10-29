import { NextRequest, NextResponse } from 'next/server';
import { qmoiTrader } from '@/lib/qmoi-trader';
import libProposals from '../../../../lib/proposals';

// POST /api/cashon/start-trading
export async function POST(request: NextRequest) {
  try {
    const auth = libProposals.requireApiKey(request.headers);
    if (!auth.ok) {
      const r = auth.response;
      return NextResponse.json(r.body, { status: r.status });
    }

    const canRun = process.env.PRODUCTION_CONFIRMED === 'true' && process.argv.indexOf('--real') !== -1;
    const proposal = { title: 'Start trading', description: 'Start AI trading loop', payload: {}, requestedAt: new Date().toISOString(), willRun: !!canRun };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({ status: 'proposed', message: 'Start trading proposed (dry-run)' });
    }

    await qmoiTrader.startTrading();
    return NextResponse.json({ 
      success: true, 
      message: 'AI trading started successfully' 
    });
  } catch (error) {
    console.error('Start trading API error:', error);
    return NextResponse.json(
      { error: 'Failed to start trading' },
      { status: 500 }
    );
  }
}