import * as fs from 'fs';
import * as path from 'path';
import { requireRole } from '../auth/rbac';

const ADMIN_KEY = process.env.QCITY_ADMIN_KEY || 'changeme';
const AUDIT_LOG_PATH = path.resolve(process.cwd(), 'logs/qcity_audit.log');

const handler = requireRole(['admin', 'master'])(async (req: any, res: any) => {
  const { method, query } = req;
  if (method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!fs.existsSync(AUDIT_LOG_PATH)) return res.status(200).json({ items: [], total: 0, page: 1, pageSize: 50, totalPages: 1 });
  const raw = fs.readFileSync(AUDIT_LOG_PATH, 'utf-8');
  const lines = raw.split('\n').filter(Boolean);
  let logs = lines.map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  // Filtering
  if (query.user) logs = logs.filter((l: any) => l.user && l.user.includes(query.user));
  if (query.action) logs = logs.filter((l: any) => l.action && l.action.includes(query.action));
  if (query.status) logs = logs.filter((l: any) => l.status && l.status.includes(query.status));
  if (query.date) logs = logs.filter((l: any) => l.timestamp && l.timestamp.startsWith(query.date));
  // Pagination
  const page = parseInt(query.page) || 1;
  const pageSize = parseInt(query.pageSize) || 50;
  const total = logs.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const items = logs.slice((page - 1) * pageSize, page * pageSize);
  // Export
  if (query.export === 'csv') {
    const header = 'Timestamp,User,Action,Device,Status,Command';
    const rows = items.map((log: any) =>
      [log.timestamp, log.user, log.action, log.deviceId, log.status, log.command.replace(/"/g, '""')].map(x => `"${x || ''}"`).join(',')
    );
    const csv = [header, ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="qmoi_audit_log.csv"');
    return res.status(200).send(csv);
  }
  if (query.export === 'json') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="qmoi_audit_log.json"');
    return res.status(200).send(JSON.stringify(items, null, 2));
  }
  res.status(200).json({ items, total, page, pageSize, totalPages });
});

export default handler; 