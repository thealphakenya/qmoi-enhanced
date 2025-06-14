import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const adminToken = req.headers['x-admin-token'];
  if (adminToken !== process.env.ADMIN_TOKEN) return res.status(403).json({ error: 'Forbidden' });

  if (req.method === 'GET') {
    if (req.query.errors) {
      // Proxy to anomaly service for error list
      const result = await fetch('http://localhost:5001/analytics', { method: 'GET' }).then(r => r.json());
      // Simulate error list for demo
      const errors = result.top_ips && result.top_ips.length ? result.top_ips.map(([ip, count]: [string, number]) => `Suspicious activity from ${ip} (${count} attempts)`) : [];
      return res.json({ errors });
    }
    return res.status(400).json({ error: 'Unknown GET action' });
  }

  if (req.method === 'POST') {
    if (req.query.fix) {
      // Simulate auto-fix (could trigger a script, restart service, etc.)
      // In production, implement real fix logic
      return res.json({ status: 'fixed' });
    }
    return res.status(400).json({ error: 'Unknown POST action' });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
