import { NextRequest, NextResponse } from 'next/server';
import { sendAlertWebhook, type AlertPayload } from '@/lib/alerts/webhook';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = body as AlertPayload;

    if (!payload || !payload.message || !payload.level) {
      return NextResponse.json({ error: 'Alert payload requires level and message' }, { status: 400 });
    }

    const success = await sendAlertWebhook(payload);
    return NextResponse.json({
      success,
      delivered: success,
      payload,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unable to deliver alert webhook',
    }, { status: 500 });
  }
}
