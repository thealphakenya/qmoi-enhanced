import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { biometricService } from '@/lib/auth/biometric-service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const method = body.method as 'fingerprint' | 'facial' | 'voice';
    const templateData = body.templateData as string;

    if (!method || !templateData) {
      return NextResponse.json(
        { error: 'Missing method or templateData' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(templateData, 'base64');
    const result = await biometricService.verifyBiometric(
      session.user.id,
      method,
      buffer
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Biometric verify error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to verify biometric' },
      { status: 500 }
    );
  }
}
