import { NextRequest, NextResponse } from 'next/server';
import { cashonWallet } from '@/lib/cashon-wallet';
import libProposals from '../../../../lib/proposals';

// POST /api/cashon/deposit
export async function POST(request: NextRequest) {
  try {
    const auth = libProposals.requireApiKey(request.headers);
    if (!auth.ok) {
      const r = auth.response;
      return NextResponse.json(r.body, { status: r.status });
    }

    const canRun = process.env.PRODUCTION_CONFIRMED === 'true' && process.argv.indexOf('--real') !== -1;
    const runtimeToken = process.env.MASTER_TOKEN || '';

    const body = await request.json();
    const { amount } = body;

    if (!amount || amount < 10) {
      return NextResponse.json({ error: 'Invalid amount - minimum KES 10' }, { status: 400 });
    }

    const proposal = { title: 'Cashon deposit', description: 'Initiate deposit', payload: { amount }, requestedAt: new Date().toISOString(), willRun: !!canRun };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({ status: 'proposed', message: 'Deposit proposed (dry-run)' });
    }

    const depositId = await cashonWallet.initiateDeposit(amount, runtimeToken);
    return NextResponse.json({ 
      success: true, 
      depositId,
      message: `Deposit request initiated for KES ${amount}` 
    });
  } catch (error) {
    console.error('Deposit API error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate deposit' },
      { status: 500 }
    );
  }
}