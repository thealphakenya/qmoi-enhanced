import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { consciousnessBridge } from '@/lib/consciousness/consciousness-bridge';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const action = body.action as string;
    const details = body.details || {};
    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    await consciousnessBridge.recordAction(session.user.id, action, details);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Consciousness state error:', error);
    return NextResponse.json({ error: 'Failed to record consciousness action' }, { status: 500 });
  }
}
