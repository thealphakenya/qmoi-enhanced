import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    version: 'v1',
    message: 'QMOI API version 1 is available',
    timestamp: new Date().toISOString(),
  });
}
