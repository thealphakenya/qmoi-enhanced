import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { biometricService } from '@/lib/auth/biometric-service';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { method: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const method = params.method as 'fingerprint' | 'facial' | 'voice';
    if (!method) {
      return NextResponse.json({ error: 'Biometric method required' }, { status: 400 });
    }

    const result = await biometricService.deleteBiometric(session.user.id, method);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Biometric delete error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete biometric method' }, { status: 500 });
  }
}
