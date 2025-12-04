import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import fs from 'fs';
import path from 'path';

const FINGERPRINTS_FILE = path.join(process.cwd(), 'data', 'fingerprints.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(FINGERPRINTS_FILE))) {
  fs.mkdirSync(path.dirname(FINGERPRINTS_FILE), { recursive: true });
}

// Initialize fingerprints file if it doesn't exist
if (!fs.existsSync(FINGERPRINTS_FILE)) {
  fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify([]));
}

export async function GET(request: NextRequest) {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const acceptLanguage = headersList.get('accept-language') || '';
  const platform = headersList.get('sec-ch-ua-platform') || '';

  const fingerprint = {
    userAgent,
    acceptLanguage,
    platform,
    timestamp: new Date().toISOString()
  };

  return NextResponse.json(fingerprint);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fingerprint, user, deviceInfo, location } = body;

    const fingerprints = JSON.parse(fs.readFileSync(FINGERPRINTS_FILE, 'utf-8'));
    fingerprints.push({
      fingerprint,
      user,
      deviceInfo,
      location,
      timestamp: new Date().toISOString()
    });

    fs.writeFileSync(FINGERPRINTS_FILE, JSON.stringify(fingerprints, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 