import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import fs from 'fs';

function runCommand(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, { timeout: 20000 }, (err, stdout, stderr) => {
      if (err) return reject(stderr || err.message);
      resolve(stdout);
    });
  });
}

async function callPythonAnomalyService(events: Array<{timestamp: string; ip: string;}>) {
  // Call the Python microservice for anomaly detection
  const res = await fetch('http://localhost:5001/detect-anomaly', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events })
  });
  return await res.json();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { action } = req.query;
  try {
    switch (action) {
      case 'security-test': {
        // Wi-Fi security test: scan for networks and show encryption
        const output = await runCommand('iwlist scan 2>/dev/null');
        // Parse SSIDs and encryption
        const networks = Array.from(output.matchAll(/ESSID:"([^"]+)"[\s\S]*?Encryption key:(on|off)/g)).map(match => ({
          ssid: match[1],
          encryption: match[2] === 'on' ? 'Secured' : 'Open',
        }));
        return res.json({ result: 'Scan complete', networks });
      }
      case 'ai-hardening': {
        // Use Python microservice for anomaly detection
        let log = '';
        try {
          log = fs.readFileSync('/var/log/auth.log', 'utf8');
        } catch (e) {
          return res.json({ result: 'Log unavailable (try running as root or on a supported system).' });
        }
        // Parse failed logins
        const events = Array.from(log.matchAll(/(\w{3} \d+ \d+:\d+:\d+) [^ ]+ sshd\[\d+\]: Failed password for .* from ([\d.]+)/g)).map(m => ({
          timestamp: m[1],
          ip: m[2],
        }));
        if (events.length === 0) {
          return res.json({ result: 'No failed logins found.', alerts: [] });
        }
        const aiResult = await callPythonAnomalyService(events);
        if (aiResult.anomaly) {
          return res.json({ result: 'Monitoring complete', alerts: [`Anomaly detected! Score: ${aiResult.score}`, ...Object.entries(aiResult.ip_counts).map(([ip, c]) => `IP ${ip}: ${c} attempts`)] });
        } else {
          return res.json({ result: 'Monitoring complete. No anomaly detected.', alerts: [] });
        }
      }
      case 'network-scan': {
        // Use nmap to scan local network for open ports
        const output = await runCommand('nmap -sn 192.168.1.0/24');
        const hosts = Array.from(output.matchAll(/Nmap scan report for ([^\s]+)/g)).map(m => m[1]);
        return res.json({ result: 'Scan complete', hosts });
      }
      case 'signal-analysis': {
        // Wireless signal analysis: list signal strengths
        const output = await runCommand('iwlist scan 2>/dev/null');
        const signals = Array.from(output.matchAll(/ESSID:"([^"]+)"[\s\S]*?Signal level=([\-\d]+)/g)).map(match => ({
          ssid: match[1],
          signal: match[2],
        }));
        return res.json({ result: 'Signal analysis complete', signals });
      }
      case 'iot-scan': {
        // IoT scan: use nmap to find devices with open telnet/ftp (common IoT risks)
        const output = await runCommand('nmap -p 23,21 192.168.1.0/24');
        const risks = Array.from(output.matchAll(/Nmap scan report for ([^\s]+)[\s\S]*?([23]{2,2}\/open)/g)).map(m => ({
          host: m[1],
          open: m[2],
        }));
        return res.json({ result: 'IoT scan complete', risks });
      }
      case 'ai-agents': {
        // Simulate agent action
        return res.json({ result: 'AI agent simulated action: would patch or isolate device if threat detected.' });
      }
      default:
        return res.status(400).json({ error: 'Unknown action' });
    }
  } catch (e) {
    return res.status(500).json({ error: (e as Error).message || 'Internal error' });
  }
}
