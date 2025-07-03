import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

// Placeholder for JWT verification (replace with your actual logic)
function verifyJWT(token: string): { valid: boolean; role?: string; } {
  // TODO: Implement real JWT verification
  // For now, accept any token with 'admin' or 'master' in payload
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    if (payload && (payload.role === 'admin' || payload.role === 'master')) {
      return { valid: true, role: payload.role };
    }
    return { valid: false };
  } catch {
    return { valid: false };
  }
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  const token = auth.replace('Bearer ', '').trim();
  const jwt = verifyJWT(token);
  if (!jwt.valid) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }

  return new Promise((resolve) => {
    const ps = spawn('powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', 'scripts/qcity_npm_selfheal.ps1']);
    let output = '';
    let error = '';
    ps.stdout.on('data', (data) => {
      output += data.toString();
    });
    ps.stderr.on('data', (data) => {
      error += data.toString();
    });
    ps.on('close', (code) => {
      if (code === 0) {
        resolve(NextResponse.json({ status: 'success', log: output }));
      } else {
        resolve(NextResponse.json({ status: 'error', log: output, error: error, exitCode: code }));
      }
    });
  });
} 