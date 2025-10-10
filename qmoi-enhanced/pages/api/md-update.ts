import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Stub: Accepts all POSTs and returns success
  if (req.method === 'POST') {
    return res.status(200).json({ success: true });
  }
  res.status(405).end();
}
