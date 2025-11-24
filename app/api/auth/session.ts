import { NextApiRequest, NextApiResponse } from 'next';
import { requireRole } from './rbac';

const sessions: Record<string, { userId: string; createdAt: string; expiresAt: string }> = {};

const handler = requireRole(['user', 'admin', 'master'])(async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;
  const { id } = (req as any).user || {};
  if (method === 'GET') {
    // List sessions for user
    const userSessions = Object.entries(sessions).filter(([sid, s]) => s.userId === id).map(([sid, s]) => ({ sid, ...s }));
    return res.status(200).json({ sessions: userSessions });
  }
  if (method === 'POST' && body.action === 'revoke') {
    const { sid } = body;
    if (sessions[sid] && sessions[sid].userId === id) {
      delete sessions[sid];
      return res.status(200).json({ success: true });
    }
    return res.status(404).json({ error: 'Session not found' });
  }
  res.status(405).json({ error: 'Method not allowed' });
});

export default handler; 