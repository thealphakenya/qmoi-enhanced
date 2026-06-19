import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { privacyMaskService } from '@/lib/auth/privacy-mask';

export async function POST() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await privacyMaskService.disablePrivacyMask(session.user.id);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Privacy mask disable error:', error);
    return NextResponse.json({ error: 'Failed to disable privacy mask' }, { status: 500 });
  }
}
