import { NextRequest, NextResponse } from 'next/server';
import { qmoiRevenueEngine } from '../../../../../lib/qmoi-revenue-engine';

export async function GET(request: NextRequest) {
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

    const transactions = qmoiRevenueEngine.getTransactionHistory(50);
    
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json(
      { error: 'Failed to get transactions' },
      { status: 500 }
    );
  }
} 