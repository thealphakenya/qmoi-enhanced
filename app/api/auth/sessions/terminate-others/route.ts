import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { sessionManager } from '@/lib/auth/session-manager';

export async function POST() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id || !session.sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const count = await sessionManager.terminateAllOtherSessions(
      session.user.id,
      session.sessionId
    );

    return NextResponse.json({ success: true, terminated: count });
  } catch (error: any) {
    console.error('Terminate other sessions error:', error);
    return NextResponse.json({ error: 'Failed to terminate other sessions' }, { status: 500 });
  }
}
