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
    // In production, verify against stored master key
    if (masterKey !== process.env.QMOI_MASTER_API_KEY) {
      return NextResponse.json({ error: 'Invalid master key' }, { status: 403 });
    }

    const revenueData = qmoiRevenueEngine.getTotalEarnings();
    
    return NextResponse.json(revenueData);
  } catch (error) {
    console.error('Revenue status error:', error);
    return NextResponse.json(
      { error: 'Failed to get revenue status' },
      { status: 500 }
    );
  }
} 