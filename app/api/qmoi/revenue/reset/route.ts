import { NextRequest, NextResponse } from 'next/server';
import { qmoiRevenueEngine } from '../../../../../lib/qmoi-revenue-engine';

export async function POST(request: NextRequest) {
  try {
    // Verify master access
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Master access required' }, { status: 401 });
    }

    const masterKey = authHeader.substring(7);
    if (masterKey !== process.env.QMOI_MASTER_API_KEY) {
      return NextResponse.json({ error: 'Invalid master key' }, { status: 403 });
    }

    // Enable master mode and execute command
    qmoiRevenueEngine.setMasterMode(true);
    const result = await qmoiRevenueEngine.executeMasterCommand('reset_daily');
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Reset daily earnings error:', error);
    return NextResponse.json(
      { error: 'Failed to reset daily earnings' },
      { status: 500 }
    );
  }
} 