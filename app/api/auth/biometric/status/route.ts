import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { biometricService } from '@/lib/auth/biometric-service';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const status = await biometricService.getBiometricStatus(session.user.id);
    return NextResponse.json(status);
  } catch (error: any) {
    console.error('Biometric status error:', error);
    return NextResponse.json({ error: 'Failed to retrieve biometric status' }, { status: 500 });
  }
}
