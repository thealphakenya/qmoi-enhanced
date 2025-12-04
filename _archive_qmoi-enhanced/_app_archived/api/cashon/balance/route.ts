import { NextRequest, NextResponse } from 'next/server';
import { cashonWallet } from '../../../../lib/cashon-wallet';
import { logEvent } from '../../../../lib/security_check';

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

    const balance = await cashonWallet.getBalance(masterToken);
    const url = new URL(request.url);
    if (url.searchParams.get('mpesaInfo') === 'true') {
      const mpesaNumber = process.env.CASHON_MPESA_NUMBER || '';
      const masked = mpesaNumber ? mpesaNumber.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2') : '';
      return NextResponse.json({ mpesaNumberMasked: masked });
    }
    if (url.searchParams.get('logs') === 'true') {
      // TODO: Fetch logs from DB or file
      const logs = [];
      return NextResponse.json({ logs });
    }
    return NextResponse.json(balance);
  } catch (error) {
    console.error('Balance API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/cashon/balance
export async function POST(req: Request) {
  const { action } = await req.json();
  if (action === 'sync-mpesa') {
    const mpesaNumber = process.env.CASHON_MPESA_NUMBER;
    if (!mpesaNumber) {
      logEvent('mpesa_sync_failed', { reason: 'Missing M-Pesa number' });
      return new Response(JSON.stringify({ error: 'M-Pesa number not configured' }), { status: 500 });
    }
    // Simulate transfer logic here
    try {
      // TODO: Integrate with real M-Pesa API
      logEvent('mpesa_sync_success', { mpesaNumber });
      return new Response(JSON.stringify({ success: true, mpesaNumber }), { status: 200 });
    } catch (err) {
      logEvent('mpesa_sync_failed', { error: err.message });
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }
  // ... existing code ...
} 