const express = require('express');
const fs = require('fs');
const app = express();
const LOG_FILE = './logs/qmoi_media_orchestrator.log';

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/logs', (req, res) => {
  const logs = fs.existsSync(LOG_FILE) ? fs.readFileSync(LOG_FILE, 'utf-8') : '';
  res.type('text/plain').send(logs);
});

app.listen(4000, () => console.log('QMOI Dashboard running on http://localhost:4000')); 