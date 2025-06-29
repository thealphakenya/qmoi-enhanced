import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// In-memory key store (replace with persistent storage in production)
let apiKeys: { key: string; createdAt: string; revoked: boolean; usage: number }[] = [];

function generateKey() {
  return crypto.randomBytes(32).toString('hex');
}

// Generate 20 keys on first load
if (apiKeys.length === 0) {
  for (let i = 0; i < 20; i++) {
    apiKeys.push({ key: generateKey(), createdAt: new Date().toISOString(), revoked: false, usage: 0 });
  }
  // TODO: Save to keys/ directory
}

export async function GET(req: NextRequest) {
  // List all keys (hide revoked by default)
  const url = new URL(req.url);
  const showRevoked = url.searchParams.get('showRevoked') === 'true';
  const keys = showRevoked ? apiKeys : apiKeys.filter(k => !k.revoked);
  return NextResponse.json({ keys });
}

export async function POST(req: NextRequest) {
  // Create a new key
  const key = generateKey();
  apiKeys.push({ key, createdAt: new Date().toISOString(), revoked: false, usage: 0 });
  // TODO: Save to keys/ directory
  return NextResponse.json({ key });
}

export async function DELETE(req: NextRequest) {
  // Revoke a key
  const body = await req.json();
  const { key } = body;
  const idx = apiKeys.findIndex(k => k.key === key);
  if (idx === -1) return NextResponse.json({ error: 'Key not found' }, { status: 404 });
  apiKeys[idx].revoked = true;
  // TODO: Save to keys/ directory
  return NextResponse.json({ success: true });
}

// GET /api/qapikey/usage - Usage stats
export async function GET_USAGE(req: NextRequest) {
  // Return usage stats for all keys
  return NextResponse.json({ usage: apiKeys.map(k => ({ key: k.key, usage: k.usage })) });
} 