import { NextRequest, NextResponse } from 'next/server';
import { cashonWallet } from '@/lib/cashon-wallet';
import { qmoiTrader } from '@/lib/qmoi-trader';

// Verify master token
function verifyMasterToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  const masterToken = process.env.MASTER_TOKEN;
  
  return token === masterToken ? token : null;
}

// GET /api/cashon/balance
export async function GET(request: NextRequest) {
  try {
    const masterToken = verifyMasterToken(request);
    if (!masterToken) {
      return NextResponse.json({ error: 'Master access required' }, { status: 401 });
    }

    const url = new URL(request.url);
    const path = url.pathname.split('/').pop();

    switch (path) {
      case 'balance':
        const balance = await cashonWallet.getBalance(masterToken);
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
    const masterToken = verifyMasterToken(request);
    if (!masterToken) {
      return NextResponse.json({ error: 'Master access required' }, { status: 401 });
    }

    const url = new URL(request.url);
    const path = url.pathname.split('/').pop();
    const body = await request.json();

    switch (path) {
      case 'deposit':
        const { amount } = body;
        if (!amount || amount < 10) {
          return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }
        
        const depositId = await cashonWallet.initiateDeposit(amount, masterToken);
        return NextResponse.json({ success: true, depositId });

      case 'approve-deposit':
        const { transactionId } = body;
        if (!transactionId) {
          return NextResponse.json({ error: 'Transaction ID required' }, { status: 400 });
        }
        
        const approved = await cashonWallet.approveDeposit(transactionId, masterToken);
        return NextResponse.json({ success: approved });

      case 'withdraw':
        const { withdrawAmount } = body;
        if (!withdrawAmount || withdrawAmount < 10) {
          return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }
        
        const withdrawalId = await cashonWallet.withdrawFunds(withdrawAmount, masterToken);
        return NextResponse.json({ success: true, withdrawalId });

      case 'start-trading':
        await qmoiTrader.startTrading();
        return NextResponse.json({ success: true, message: 'AI trading started' });

      case 'stop-trading':
        await qmoiTrader.stopTrading();
        return NextResponse.json({ success: true, message: 'AI trading stopped' });

      case 'trade':
        const { tradeAmount, asset, strategy, confidence } = body;
        if (!tradeAmount || !asset || !strategy || !confidence) {
          return NextResponse.json({ error: 'Missing trade parameters' }, { status: 400 });
        }
        
        const tradeId = await cashonWallet.requestTrade(tradeAmount, asset, strategy, confidence);
        return NextResponse.json({ success: true, tradeId });

      case 'approve-trade':
        const { tradeId: tradeToApprove } = body;
        if (!tradeToApprove) {
          return NextResponse.json({ error: 'Trade ID required' }, { status: 400 });
        }
        
        const tradeApproved = await cashonWallet.approveTrade(tradeToApprove, false);
        return NextResponse.json({ success: tradeApproved });

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
    const masterToken = verifyMasterToken(request);
    if (!masterToken) {
      return NextResponse.json({ error: 'Master access required' }, { status: 401 });
    }

    const url = new URL(request.url);
    const path = url.pathname.split('/').pop();
    const body = await request.json();

    switch (path) {
      case 'strategy':
        const { strategyId, updates } = body;
        if (!strategyId || !updates) {
          return NextResponse.json({ error: 'Strategy ID and updates required' }, { status: 400 });
        }
        
        qmoiTrader.updateStrategy(strategyId, updates);
        return NextResponse.json({ success: true });

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