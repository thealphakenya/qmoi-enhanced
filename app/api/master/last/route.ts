import { NextResponse } from 'next/server';
import fs from 'fs';

const STORAGE = process.env.MASTER_COMMAND_FILE || '/tmp/qmoi_master_command.json';

export async function GET() {
  try {
    if (!fs.existsSync(STORAGE)) {
      return NextResponse.json({ success: true, command: null });
    }
    const raw = fs.readFileSync(STORAGE, 'utf8');
    const command = JSON.parse(raw || 'null');
    return NextResponse.json({ success: true, command });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Failed to read last command' }, { status: 500 });
  }
}
