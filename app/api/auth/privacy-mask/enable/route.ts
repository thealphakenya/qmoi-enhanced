import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { privacyMaskService } from '@/lib/auth/privacy-mask';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const level = body.level as 'basic' | 'full' | undefined;
    if (!level || !['basic', 'full'].includes(level)) {
      return NextResponse.json({ error: 'Privacy level must be basic or full' }, { status: 400 });
    }

    const result = await privacyMaskService.enablePrivacyMask(session.user.id, level);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Privacy mask enable error:', error);
    return NextResponse.json({ error: 'Failed to enable privacy mask' }, { status: 500 });
  }
}
