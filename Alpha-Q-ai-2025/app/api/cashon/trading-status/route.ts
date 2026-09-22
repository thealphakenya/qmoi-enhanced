import { NextRequest, NextResponse } from 'next/server';
import { cashonWallet } from '@/lib/cashon-wallet';

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

// GET /api/cashon/trading-status
export async function GET(request: NextRequest) {
  try {
    const masterToken = verifyMasterToken(request);
    if (!masterToken) {
      return NextResponse.json({ error: 'Master access required' }, { status: 401 });
    }

    const status = await cashonWallet.getTradingStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error('Trading status API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 