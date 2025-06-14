import type { NextApiRequest, NextApiResponse } from 'next';

// Simulated WhatsApp bot status and QR (in production, use IPC or websocket to communicate with Node bot)
let botStatus = 'disconnected';
let qrImage = null;
const log: string[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    if (req.query.qr) {
      // Return QR code image (simulate)
      return res.json({ qr: qrImage });
    }
    if (req.query.status) {
      return res.json({ status: botStatus });
    }
    if (req.query.log) {
      return res.json({ log });
    }
    return res.status(400).json({ error: 'Unknown GET action' });
  }
  if (req.method === 'POST') {
    if (req.query.update) {
      // Update status, QR, or log (simulate, in production update from Node bot)
      const { status, qr, message } = req.body;
      if (status) botStatus = status;
      if (qr) qrImage = qr;
      if (message) log.push(message);
      return res.json({ ok: true });
    }
    return res.status(400).json({ error: 'Unknown POST action' });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
