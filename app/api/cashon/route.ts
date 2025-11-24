import { NextRequest, NextResponse } from 'next/server';
import { cashonWallet } from '@/lib/cashon-wallet';
import { qmoiTrader } from '@/lib/qmoi-trader';
import libProposals from '../../../lib/proposals';

// GET /api/cashon/balance
export async function GET(request: NextRequest) {
  try {
    // Read endpoints respect API key when configured
    const auth = libProposals.requireApiKey(request.headers);
    if (!auth.ok) {
      const r = auth.response;
      return NextResponse.json(r.body, { status: r.status });
    }

    const url = new URL(request.url);
    const path = url.pathname.split('/').pop();

    switch (path) {
      case 'balance':
        const balance = await cashonWallet.getBalance();
        return NextResponse.json(balance);

      case 'trading-status':
        const status = await cashonWallet.getTradingStatus();
        return NextResponse.json(status);

      case 'qmoi-status':
        const qmoiStatus = await qmoiTrader.getStatus();
        return NextResponse.json(qmoiStatus);

      case 'signals':
        const signals = qmoiTrader.getRecentSignals(10);
        return NextResponse.json(signals);

      case 'performance':
        const performance = await qmoiTrader.getPerformanceMetrics();
        return NextResponse.json(performance);

      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }
  } catch (error) {
    console.error('Cashon API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/cashon/actions
export async function POST(request: NextRequest) {
  try {
    // API-key gating for mutating actions
    const auth = libProposals.requireApiKey(request.headers);
    if (!auth.ok) {
      const r = auth.response;
      return NextResponse.json(r.body, { status: r.status });
    }

    const canRun = process.env.PRODUCTION_CONFIRMED === 'true' && process.argv.indexOf('--real') !== -1;
    const runtimeToken = process.env.MASTER_TOKEN || '';

    const url = new URL(request.url);
    const path = url.pathname.split('/').pop();
    const body = await request.json();

    switch (path) {
      case 'deposit': {
        const { amount } = body;
        if (!amount || amount < 10) {
          return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        const proposal = { title: 'Cashon deposit', description: 'Initiate deposit', payload: { amount }, requestedAt: new Date().toISOString(), willRun: !!canRun };
        if (!canRun) {
          await libProposals.writeProposal(proposal);
          return NextResponse.json({ status: 'proposed', message: 'Deposit proposed (dry-run)' });
        }

        const depositId = await cashonWallet.initiateDeposit(amount, runtimeToken);
        return NextResponse.json({ success: true, depositId });
      }

      case 'approve-deposit': {
        const { transactionId } = body;
        if (!transactionId) {
          return NextResponse.json({ error: 'Transaction ID required' }, { status: 400 });
        }
        const proposal = { title: 'Approve deposit', description: 'Approve a deposit transaction', payload: { transactionId }, requestedAt: new Date().toISOString(), willRun: !!canRun };
        if (!canRun) {
          await libProposals.writeProposal(proposal);
          return NextResponse.json({ status: 'proposed', message: 'Approve deposit proposed (dry-run)' });
        }
        const approved = await cashonWallet.approveDeposit(transactionId, runtimeToken);
        return NextResponse.json({ success: approved });
      }

      case 'withdraw': {
        const { withdrawAmount } = body;
        if (!withdrawAmount || withdrawAmount < 10) {
          return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }
        const proposal = { title: 'Cashon withdraw', description: 'Withdraw funds', payload: { withdrawAmount }, requestedAt: new Date().toISOString(), willRun: !!canRun };
        if (!canRun) {
          await libProposals.writeProposal(proposal);
          return NextResponse.json({ status: 'proposed', message: 'Withdrawal proposed (dry-run)' });
        }
        const withdrawalId = await cashonWallet.withdrawFunds(withdrawAmount, runtimeToken);
        return NextResponse.json({ success: true, withdrawalId });
      }

      case 'start-trading': {
        const proposal = { title: 'Start trading', description: 'Start AI trading loop', payload: {}, requestedAt: new Date().toISOString(), willRun: !!canRun };
        if (!canRun) {
          await libProposals.writeProposal(proposal);
          return NextResponse.json({ status: 'proposed', message: 'Start trading proposed (dry-run)' });
        }
        await qmoiTrader.startTrading();
        return NextResponse.json({ success: true, message: 'AI trading started' });
      }

      case 'stop-trading': {
        const proposal = { title: 'Stop trading', description: 'Stop AI trading loop', payload: {}, requestedAt: new Date().toISOString(), willRun: !!canRun };
        if (!canRun) {
          await libProposals.writeProposal(proposal);
          return NextResponse.json({ status: 'proposed', message: 'Stop trading proposed (dry-run)' });
        }
        await qmoiTrader.stopTrading();
        return NextResponse.json({ success: true, message: 'AI trading stopped' });
      }

      case 'trade': {
        const { tradeAmount, asset, strategy, confidence } = body;
        if (!tradeAmount || !asset || !strategy || !confidence) {
          return NextResponse.json({ error: 'Missing trade parameters' }, { status: 400 });
        }
        const proposal = { title: 'Execute trade', description: 'Request trade via Cashon', payload: { tradeAmount, asset, strategy, confidence }, requestedAt: new Date().toISOString(), willRun: !!canRun };
        if (!canRun) {
          await libProposals.writeProposal(proposal);
          return NextResponse.json({ status: 'proposed', message: 'Trade proposed (dry-run)' });
        }
        const tradeId = await cashonWallet.requestTrade(tradeAmount, asset, strategy, confidence);
        return NextResponse.json({ success: true, tradeId });
      }

      case 'approve-trade': {
        const { tradeId: tradeToApprove } = body;
        if (!tradeToApprove) {
          return NextResponse.json({ error: 'Trade ID required' }, { status: 400 });
        }
        const proposal = { title: 'Approve trade', description: 'Approve a requested trade', payload: { tradeToApprove }, requestedAt: new Date().toISOString(), willRun: !!canRun };
        if (!canRun) {
          await libProposals.writeProposal(proposal);
          return NextResponse.json({ status: 'proposed', message: 'Approve trade proposed (dry-run)' });
        }
        const tradeApproved = await cashonWallet.approveTrade(tradeToApprove, false);
        return NextResponse.json({ success: tradeApproved });
      }

      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }
  } catch (error) {
    console.error('Cashon API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/cashon/config
export async function PUT(request: NextRequest) {
  try {
    // API-key gating for config changes
    const auth = libProposals.requireApiKey(request.headers);
    if (!auth.ok) {
      const r = auth.response;
      return NextResponse.json(r.body, { status: r.status });
    }

    const canRun = process.env.PRODUCTION_CONFIRMED === 'true' && process.argv.indexOf('--real') !== -1;
    const url = new URL(request.url);
    const path = url.pathname.split('/').pop();
    const body = await request.json();

    switch (path) {
      case 'strategy': {
        const { strategyId, updates } = body;
        if (!strategyId || !updates) {
          return NextResponse.json({ error: 'Strategy ID and updates required' }, { status: 400 });
        }
        const proposal = { title: 'Update strategy', description: 'Update trading strategy configuration', payload: { strategyId, updates }, requestedAt: new Date().toISOString(), willRun: !!canRun };
        if (!canRun) {
          await libProposals.writeProposal(proposal);
          return NextResponse.json({ status: 'proposed', message: 'Strategy update proposed (dry-run)' });
        }
        qmoiTrader.updateStrategy(strategyId, updates);
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }
  } catch (error) {
    console.error('Cashon API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 