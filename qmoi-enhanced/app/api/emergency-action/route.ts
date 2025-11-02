import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'unknown';
    const timestamp = new Date().toISOString();

    const logDir = path.join(process.cwd(), '.qmoi_validation');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
    const logPath = path.join(logDir, 'emergency_actions.log');

    const entry = { timestamp, action, body };
    fs.appendFileSync(logPath, JSON.stringify(entry) + '\n');

    // By default this endpoint only logs the action (dry-run). Forwarding to
    // real providers requires QMOI_ALLOW_NETWORK=true and provider-specific
    // credentials and adapters.
    const allowLive = process.env.QMOI_ALLOW_NETWORK === 'true' && process.env.PRODUCTION_CONFIRMED === 'true';
    if (!allowLive) {
      return NextResponse.json({ ok: true, message: `${action} logged (dry-run)` });
    }

    // If live actions are enabled, adapters should be implemented to forward
    // to telephony/mail/device managers. For safety this repo does not auto-perform
    // live emergency actions unless a production adapter is present and enabled.
    // If you implement adapters, return their messages here.

    return NextResponse.json({ ok: true, message: `${action} logged (dry-run)` });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
