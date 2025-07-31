import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.json({ error: 'SSH is only available in production.' }, { status: 403 });
  }

  try {
    const { writeRemoteFile } = await import('@/lib/ssh-utils');
    const body = await req.json();
    const result = await writeRemoteFile(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal SSH error' }, { status: 500 });
  }
}
