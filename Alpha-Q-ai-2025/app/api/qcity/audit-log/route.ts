import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const ADMIN_KEY = process.env.QCITY_ADMIN_KEY || 'changeme';
const AUDIT_LOG = path.join(process.cwd(), 'logs/qcity_audit.log');

function parseLogLine(line: string) {
  try { return JSON.parse(line); } catch { return null; }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const key = req.headers['x-qcity-admin-key'];
  if (key !== ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });
  const { format = 'json', limit = 100, offset = 0, action, user, deviceId, status } = req.query;
  if (!fs.existsSync(AUDIT_LOG)) return res.status(200).json({ logs: [] });
  const lines = fs.readFileSync(AUDIT_LOG, 'utf-8').split('\n').filter(Boolean);
  let logs = lines.map(parseLogLine).filter(Boolean);
  if (action) logs = logs.filter(l => l.action === action);
  if (user) logs = logs.filter(l => l.user === user);
  if (deviceId) logs = logs.filter(l => l.deviceId === deviceId);
  if (status) logs = logs.filter(l => l.status === status);
  const paged = logs.slice(Number(offset), Number(offset) + Number(limit));
  if (format === 'csv') {
    const keys = Object.keys(paged[0] || {});
    const csv = [keys.join(','), ...paged.map(l => keys.map(k => JSON.stringify(l[k] || '')).join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    return res.status(200).send(csv);
  }
  res.status(200).json({ logs: paged, total: logs.length });
} 