---
title: "Issue draft for qmoi-enhanced/app/api/qmoi/auto-fix/start/route.ts"
generated: 2025-11-08T16:06:38.784607Z
---

# Review needed: qmoi-enhanced/app/api/qmoi/auto-fix/start/route.ts

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its [AUTOFIXED by Ollama at 2026-07-26T18:54:42.022427Z] markers or [AUTOFIXED by Ollama at 2026-07-26T18:54:42.022427Z]s.
- If the file is safe for production, remove the [AUTOFIXED by Ollama at 2026-07-26T18:54:42.022427Z] and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { writeFileSync } from 'fs';
import os from 'os';

function requireApiKey(request: NextRequest) {
  const key = request.headers.get('x-qmoi-api-key') || '';
  const expected = process.env.QMOI_API_KEY || '';
  if (!expected) return true;
  return key === expected;
}

async function writeProposal(proposal: any) {
  try {
    const dir = '.qmoi_validation';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    const file = path.join(dir, 'auto_fix_proposals.json');
    let agg: any[] = [];
    if (fs.existsSync(file)) {
      try { agg = JSON.parse(fs.readFileSync(file, 'utf8') || '[]'); } catch (e) { agg = []; }
    }
    agg.push(proposal);
    fs.writeFileSync(file, JSON.stringify(agg, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write auto-fix proposal:', err && (err as any).message ? (err as any).message : err);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!requireApiKey(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const scriptPath = path.join(process.cwd(), 'scripts', 'qmoi_auto_fix_enhanced.py');

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json({ error: 'Auto-fix script not found' }, { status: 404 });
    }

    const canRun = process.env.PRODUCTION_CONFIRMED === 'true' && process.argv.indexOf('--real') !== -1;
    const proposal = { type: 'start_auto_fix', script: scriptPath, requestedAt: new Date().toISOString(), willRun: !!canRun };
    if (!canRun) {
      await writeProposal(proposal);
      return NextResponse.json({ status: 'proposed', message: 'Auto-fix start proposed (dry-run)' });
    }

    // Start the auto-fix process (careful: server environments may not allow spawn)
    const child = spawn('python', [scriptPath], { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'] });

    child.stdout.on('data', (d) => console.log('[auto-fix]', d.toStr
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
