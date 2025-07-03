import { NextApiRequest, NextApiResponse } from 'next';
import { authenticator } from 'otplib';
import fs from 'fs';
import path from 'path';
import { requireRole } from './rbac';

const USERS_FILE = path.resolve(process.cwd(), 'data', 'users.json');
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}
function saveUsers(users: any[]) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

const handler = requireRole(['user', 'admin', 'master'])(async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;
  const { id } = (req as any).user || {};
  let users = loadUsers();
  const userIdx = users.findIndex((u: any) => u.id === id);
  if (userIdx === -1) return res.status(404).json({ error: 'User not found' });
  if (method === 'POST' && body.action === 'setup') {
    const secret = authenticator.generateSecret();
    users[userIdx].totpSecret = secret;
    saveUsers(users);
    return res.status(200).json({ secret });
  }
  if (method === 'POST' && body.action === 'verify') {
    const { code } = body;
    const secret = users[userIdx].totpSecret;
    if (!secret) return res.status(400).json({ error: 'No TOTP setup' });
    const valid = authenticator.check(code, secret);
    if (!valid) return res.status(401).json({ error: 'Invalid code' });
    users[userIdx].totpEnabled = true;
    saveUsers(users);
    return res.status(200).json({ success: true });
  }
  if (method === 'POST' && body.action === 'disable') {
    users[userIdx].totpEnabled = false;
    saveUsers(users);
    return res.status(200).json({ success: true });
  }
  res.status(405).json({ error: 'Method not allowed' });
});

export default handler; 