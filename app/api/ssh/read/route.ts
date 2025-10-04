// API endpoint to read a file over SSH
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  // Native SSH logic removed for Next.js compatibility. Use a separate backend service for SSH features.
  return NextResponse.json({ error: 'SSH file read is not supported in this environment. Please use a dedicated backend service.' }, { status: 501 });
}
