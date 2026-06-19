import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { privacyMaskService } from '@/lib/auth/privacy-mask';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const status = await privacyMaskService.getPrivacyMaskStatus(session.user.id);
    return NextResponse.json(status);
  } catch (error: any) {
    console.error('Privacy mask status error:', error);
    return NextResponse.json({ error: 'Failed to retrieve privacy mask status' }, { status: 500 });
  }
}
