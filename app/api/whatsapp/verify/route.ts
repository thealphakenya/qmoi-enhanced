import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { phone } = req.body;
  exec(`python scripts/whatsapp_verification.py ${phone}`, (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ success: false, error: stderr || error.message });
    } else {
      res.status(200).json({ success: true, result: stdout });
    }
  });
} 