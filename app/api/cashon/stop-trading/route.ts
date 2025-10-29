import { NextRequest, NextResponse } from 'next/server';
import { qmoiTrader } from '@/lib/qmoi-trader';
import libProposals from '../../../../lib/proposals';

// POST /api/cashon/stop-trading
export async function POST(request: NextRequest) {
  try {
    const auth = libProposals.requireApiKey(request.headers);
    if (!auth.ok) {
      const r = auth.response;
      return NextResponse.json(r.body, { status: r.status });
    }

    const canRun = process.env.PRODUCTION_CONFIRMED === 'true' && process.argv.indexOf('--real') !== -1;
    const proposal = { title: 'Stop trading', description: 'Stop AI trading loop', payload: {}, requestedAt: new Date().toISOString(), willRun: !!canRun };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({ status: 'proposed', message: 'Stop trading proposed (dry-run)' });
    }

    await qmoiTrader.stopTrading();
    return NextResponse.json({ 
      success: true, 
      message: 'AI trading stopped successfully' 
    });
  } catch (error) {
    console.error('Stop trading API error:', error);
    return NextResponse.json(
      { error: 'Failed to stop trading' },
      { status: 500 }
    );
  }
}