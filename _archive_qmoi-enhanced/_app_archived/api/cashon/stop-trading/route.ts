import { NextRequest, NextResponse } from 'next/server';
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

// POST /api/cashon/stop-trading
export async function POST(request: NextRequest) {
  try {
    const masterToken = verifyMasterToken(request);
    if (!masterToken) {
      return NextResponse.json({ error: 'Master access required' }, { status: 401 });
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