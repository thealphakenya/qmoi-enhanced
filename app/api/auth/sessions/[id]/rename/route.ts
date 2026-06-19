import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { sessionManager } from '@/lib/auth/session-manager';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const label = body.label as string;
    if (!label) {
      return NextResponse.json({ error: 'Label is required' }, { status: 400 });
    }

    const updatedName = await sessionManager.renameSession(
      params.id,
      session.user.id,
      label
    );

    return NextResponse.json({ success: true, deviceName: updatedName });
  } catch (error: any) {
    console.error('Rename session error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to rename session' }, { status: 500 });
  }
}
