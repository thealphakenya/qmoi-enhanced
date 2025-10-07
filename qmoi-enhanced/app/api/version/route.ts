import { NextRequest, NextResponse } from 'next/server';
import { RELEASES } from '@/components/release-notes';

export async function GET(request: NextRequest) {
  // Always return the latest release info
  return NextResponse.json({
    version: RELEASES[0].version,
    date: RELEASES[0].date,
    notes: RELEASES[0].notes,
    downloads: RELEASES[0].downloads
  });
} 