import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';

// GET: Scan for Wi-Fi networks
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Use nmcli to list Wi-Fi networks (Linux only)
    exec('nmcli -t -f SSID,SIGNAL,SECURITY,IN-USE dev wifi', (err, stdout, stderr) => {
      if (err) return res.status(500).json({ error: stderr || err.message });
      const networks = stdout.split('\n').filter(Boolean).map(line => {
        const [ssid, signal, security, inUse] = line.split(':');
        return {
          ssid,
          signal: Number(signal),
          secure: security !== '--',
          connected: inUse === '*',
        };
      });
      res.json({ networks });
    });
  } else if (req.method === 'POST') {
    // Connect to a Wi-Fi network
    const { ssid, password } = req.body;
    if (!ssid) return res.status(400).json({ error: 'SSID required' });
    // nmcli dev wifi connect <SSID> password <password>
    const cmd = password
      ? `nmcli dev wifi connect "${ssid}" password "${password}"`
      : `nmcli dev wifi connect "${ssid}"`;
    exec(cmd, (err, stdout, stderr) => {
      if (err) return res.status(500).json({ error: stderr || err.message });
      res.json({ success: true, message: stdout });
    });
  } else {
    res.status(405).end();
  }
}
