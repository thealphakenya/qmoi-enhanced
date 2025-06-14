import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

const FINGERPRINTS_PATH = '/workspaces/Alpha-Q-ai/device-fingerprints.json';

function loadFingerprints() {
  if (fs.existsSync(FINGERPRINTS_PATH)) {
    return JSON.parse(fs.readFileSync(FINGERPRINTS_PATH, 'utf8'));
  }
  return {};
}
function saveFingerprints(data: Record<string, unknown>) {
  fs.writeFileSync(FINGERPRINTS_PATH, JSON.stringify(data, null, 2));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { fingerprint, user, deviceInfo, location } = req.body;
    if (!fingerprint) return res.status(400).json({ error: 'Missing fingerprint' });
    const data = loadFingerprints();
    data[fingerprint] = { user, deviceInfo, location, lastSeen: new Date().toISOString() };
    saveFingerprints(data);
    return res.json({ ok: true });
  }
  if (req.method === 'GET') {
    const data = loadFingerprints();
    return res.json(data);
  }
  res.status(405).json({ error: 'Method not allowed' });
}
