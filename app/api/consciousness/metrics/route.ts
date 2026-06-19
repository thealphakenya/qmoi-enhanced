import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { consciousnessBridge } from '@/lib/consciousness/consciousness-bridge';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const metrics = await consciousnessBridge.getConsciousnessMetrics(session.user.id);
    return NextResponse.json(metrics);
  } catch (error: any) {
    console.error('Consciousness metrics error:', error);
    return NextResponse.json({ error: 'Failed to retrieve consciousness metrics' }, { status: 500 });
  }
}
