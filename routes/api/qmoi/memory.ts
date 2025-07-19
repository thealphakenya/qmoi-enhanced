import type { NextApiRequest, NextApiResponse } from 'next';
// import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const memoryPath = path.join(process.cwd(), 'scripts', 'models', 'qmoi_memory.json');
  if (!fs.existsSync(memoryPath)) {
    res.status(200).json({ history: [], emotions: [], preferences: {}, personality: {}, master_feedback: [] });
    return;
  }
  const memory = JSON.parse(fs.readFileSync(memoryPath, 'utf-8'));
  res.status(200).json(memory);
} 