import { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  spawn('node', ['scripts/enhanced-error-fix.js'], { detached: true, stdio: 'ignore' });
  res.status(200).json({ ok: true, message: 'All fixes triggered.' });
} 