import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { sessionManager } from '@/lib/auth/session-manager';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await sessionManager.terminateSession(params.id, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Terminate session error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to terminate session' }, { status: 500 });
  }
}
