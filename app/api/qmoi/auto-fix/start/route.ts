import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import libProposals from '../../../../lib/proposals';

export async function POST(request: NextRequest) {
  try {
    // API key gating
    const auth = libProposals.requireApiKey(request.headers);
    if (!auth.ok) {
      const r = auth.response;
      return NextResponse.json(r.body, { status: r.status });
    }

    const scriptPath = path.join(process.cwd(), 'scripts', 'qmoi_auto_fix_enhanced.py');

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json({ error: 'Auto-fix script not found' }, { status: 404 });
    }

    // Only run in real mode when explicitly confirmed. Default: propose.
    const canRun = process.env.PRODUCTION_CONFIRMED === 'true' && process.argv.indexOf('--real') !== -1;
    const proposal = {
      title: 'Start auto-fix',
      description: 'Request to start the auto-fix process (qmoi_auto_fix_enhanced.py)',
      payload: { script: scriptPath, requestedAt: new Date().toISOString(), willRun: !!canRun }
    };

    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({ status: 'proposed', message: 'Auto-fix start proposed (dry-run)' });
    }

    // Spawn the process when explicitly allowed
    const child = spawn('python', [scriptPath], { cwd: process.cwd(), stdio: ['pipe', 'pipe', 'pipe'] });

    child.stdout.on('data', (d) => console.log('[auto-fix]', d.toString()));
    child.stderr.on('data', (d) => console.error('[auto-fix][err]', d.toString()));

    return NextResponse.json({ status: 'started', message: 'Auto-fix process started', pid: child.pid });
  } catch (error) {
    console.error('Error starting auto-fix process:', error);
    return NextResponse.json({ error: 'Failed to start auto-fix process' }, { status: 500 });
  }
}