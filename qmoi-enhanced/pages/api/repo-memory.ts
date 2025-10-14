import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Stub: Returns empty memory array for now
  if (req.method === 'GET') {
    return res.status(200).json([]);
  }
  res.status(405).end();
}
