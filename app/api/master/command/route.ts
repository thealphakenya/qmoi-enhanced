import { NextResponse } from 'next/server';
import fs from 'fs';
import { logAuthEvent } from '@/app/lib/auth/memory';

const STORAGE = process.env.MASTER_COMMAND_FILE || '/tmp/qmoi_master_command.json';
const SECRET = process.env.MASTER_UI_SECRET || process.env.MASTER_SECRET || '';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const provided = req.headers.get('x-master-secret') || '';
    if (!SECRET || provided !== SECRET) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const command = {
      id: Date.now(),
      command: body.command,
      target: body.target || 'all',
      meta: body.meta || {},
      ts: new Date().toISOString(),
    };
    try {
      fs.writeFileSync(STORAGE, JSON.stringify(command, null, 2));
    } catch (e) {
      console.warn('Master command write failed', e);
    }
    // Log as a special master instruction
    try {
      await logAuthEvent({ event: 'master_command', details: command });
    } catch (e) {
      console.warn('Master command audit log failed', e);
    }
    return NextResponse.json({ success: true, command });
  } catch (_err) {
    return NextResponse.json({ success: false, message: 'Bad request' }, { status: 400 });
  }
}
