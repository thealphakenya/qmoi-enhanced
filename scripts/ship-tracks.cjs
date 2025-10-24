#!/usr/bin/env node
// ship-tracks: safely upload .den/tracks/events.log to an endpoint (qcity) if configured.
// Usage: QCITY_UPLOAD_URL and QCITY_UPLOAD_TOKEN environment variables must be set.

const fs = require('fs');
const path = require('path');
const https = require('https');

function findTrackFile() {
  const candidates = [path.join(process.cwd(), '.den', 'tracks', 'events.log'), path.join(process.cwd(), 'den', 'tracks', 'events.log')];
  for (const c of candidates) if (fs.existsSync(c)) return c;
  return null;
}

function ship(file, url, token) {
  const data = fs.readFileSync(file, 'utf8');
  const payload = JSON.stringify({ source: process.cwd(), ts: new Date().toISOString(), data });
  const u = new URL(url);
  const options = {
    hostname: u.hostname,
    path: u.pathname + (u.search || ''),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'Authorization': token ? `Bearer ${token}` : ''
    }
  };
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

(async function main(){
  const file = findTrackFile();
  if (!file) { console.error('no track file found'); process.exit(1); }
  const url = process.env.QCITY_UPLOAD_URL;
  const token = process.env.QCITY_UPLOAD_TOKEN;
  if (!url) { console.error('QCITY_UPLOAD_URL not set'); process.exit(2); }
  try {
    const res = await ship(file, url, token);
    console.log('ship-tracks: uploaded', res.status);
    process.exit(0);
  } catch (e) {
    console.error('ship-tracks: failed', e.message);
    process.exit(3);
  }
})();
