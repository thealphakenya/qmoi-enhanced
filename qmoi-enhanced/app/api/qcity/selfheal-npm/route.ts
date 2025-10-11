import { NextRequest } from 'next/server';
import { spawn } from 'child_process';
import os from 'os';
import fs from 'fs';

// [PRODUCTION IMPLEMENTATION REQUIRED] for JWT verification (replace with your actual logic)
function verifyJWT(token: string): { valid: boolean; role?: string; } {
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

function logAudit(action: string, user: string, options: any, status: string) {
  const entry = {
    timestamp: new Date().toISOString(),
    action,
    user,
    options,
    status
  };
  fs.appendFileSync('logs/qcity_audit.log', JSON.stringify(entry) + '\n');
}

function logDownloadFix(action: string, user: string, options: any, status: string, error: any = null) {
  const entry = {
    timestamp: new Date().toISOString(),
    action,
    user,
    app: 'QCity',
    device: options.device || 'unknown',
    status,
    error
  };
  fs.appendFileSync('logs/download_fixes.log', JSON.stringify(entry) + '\n');
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return new Response('Authentication required', { status: 401 });
  }
  const token = auth.replace('Bearer ', '').trim();
  const jwt = verifyJWT(token);
  if (!jwt.valid) {
    return new Response('Insufficient permissions', { status: 403 });
  }

  let options = {};
  try {
    options = await req.json();
  } catch {}

  // Determine script and args
  let script, args;
  if (os.platform() === 'win32') {
    script = 'powershell.exe';
    args = ['-ExecutionPolicy', 'Bypass', '-File', 'scripts/qcity_npm_selfheal.ps1'];
    if (options.forceClean) args.push('-ForceClean');
    if (options.essentialsOnly) args.push('-EssentialsOnly');
    if (options.upgradeAll) args.push('-UpgradeAll');
    if (options.diagnosticsOnly) args.push('-DiagnosticsOnly');
  } else {
    script = 'bash';
    args = ['scripts/qcity_npm_selfheal.sh'];
    if (options.forceClean) args.push('--force-clean');
    if (options.essentialsOnly) args.push('--essentials-only');
    if (options.upgradeAll) args.push('--upgrade-all');
    if (options.diagnosticsOnly) args.push('--diagnostics-only');
  }

  // SSE streaming
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  const ps = spawn(script, args);
  const user = jwt.role || 'unknown';
  logAudit('selfheal-trigger', user, options, 'started');
  logDownloadFix('selfheal-trigger', user, options, 'started');

  ps.stdout.on('data', (data) => {
    writer.write(encoder.encode(`data: ${data.toString()}\n`));
  });
  ps.stderr.on('data', (data) => {
    writer.write(encoder.encode(`data: [ERROR] ${data.toString()}\n`));
  });
  ps.on('close', (code) => {
    writer.write(encoder.encode(`data: [DONE]\n`));
    writer.close();
    logAudit('selfheal-complete', user, options, code === 0 ? 'success' : 'error');
    logDownloadFix('selfheal-complete', user, options, code === 0 ? 'success' : 'error');
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
} 