import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

const MEMORY_FILE = path.resolve(process.cwd(), 'qmoi_memory.json');

function readMemory(user?: string) {
  if (!fs.existsSync(MEMORY_FILE)) return [];
  const all = JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf-8'));
  if (!user) return all;
  return all.filter((entry: any) => entry.user === user);
}

function saveMemory(entry: any) {
  let all = [];
  if (fs.existsSync(MEMORY_FILE)) {
    all = JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf-8'));
  }
  all.push(entry);
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(all, null, 2));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const user = req.query.user as string | undefined;
    return res.status(200).json(readMemory(user));
  }
  if (req.method === 'POST') {
    const entry = req.body;
    saveMemory(entry);
    return res.status(201).json({ success: true });
  }
  res.status(405).end();
}
