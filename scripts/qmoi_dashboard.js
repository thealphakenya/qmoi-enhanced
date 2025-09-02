const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { sendEmail, sendSlack, sendWhatsApp } = require('./qmoi_notifier');
const axios = require('axios');
const app = express();
const LOG_FILE = './logs/qmoi_media_orchestrator.log';
const ERROR_FIX_LOG = './logs/error_fix_summary.json';
const GITHUB_STATUS_FILE = './logs/github_status.json';

const DASH_USER = process.env.QMOI_DASH_USER || 'admin';
const DASH_PASS = process.env.QMOI_DASH_PASS || 'password';

app.use(session({ secret: 'qmoi-dashboard', resave: false, saveUninitialized: true }));
app.use(express.urlencoded({ extended: true }));

function requireAuth(req, res, next) {
  if (req.path === '/health') return next();
  if (req.session && req.session.authenticated) return next();
  if (req.method === 'POST' && req.path === '/login') return next();
  res.send(`<form method="POST" action="/login"><h2>QMOI Dashboard Login</h2><input name="user" placeholder="Username"/><br/><input name="pass" type="password" placeholder="Password"/><br/><button type="submit">Login</button></form>`);
}

app.use(requireAuth);

app.post('/login', (req, res) => {
  if (req.body.user === DASH_USER && req.body.pass === DASH_PASS) {
    req.session.authenticated = true;
    res.redirect('/');
  } else {
    res.send('Login failed. <a href="/">Try again</a>');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/logs', (req, res) => {
  const logs = fs.existsSync(LOG_FILE) ? fs.readFileSync(LOG_FILE, 'utf-8') : '';
  res.type('text/plain').send(logs);
});

app.get('/error-fix-stats', (req, res) => {
  if (!fs.existsSync(ERROR_FIX_LOG)) return res.json({});
  const log = JSON.parse(fs.readFileSync(ERROR_FIX_LOG, 'utf-8'));
  const latest = log[log.length - 1];
  res.json(latest);
});

app.post('/trigger-fix', (req, res) => {
  try {
    execSync('node ./scripts/enhanced-error-fix.js');
    let stats = {};
    if (fs.existsSync(ERROR_FIX_LOG)) {
      const log = JSON.parse(fs.readFileSync(ERROR_FIX_LOG, 'utf-8'));
      stats = log[log.length - 1];
    }
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.toString() });
  }
});

app.post('/send-test-notification', async (req, res) => {
  try {
    await sendEmail('QMOI Test Notification', 'This is a test email from the dashboard.');
    await sendSlack('QMOI Test Notification from dashboard.');
    await sendWhatsApp('QMOI Test Notification from dashboard.');
    res.send('Test notification sent! <a href="/">Back</a>');
  } catch (err) {
    res.send('Notification failed: ' + err + ' <a href="/">Back</a>');
  }
});

app.get('/', async (req, res) => {
  let stats = {};
  let log = [];
  if (fs.existsSync(ERROR_FIX_LOG)) {
    log = JSON.parse(fs.readFileSync(ERROR_FIX_LOG, 'utf-8'));
    stats = log[log.length - 1];
  }
  // Fetch AI error predictions
  let predictions = [];
  try {
    const predRes = await axios.get('http://localhost:4100/api/predictions');
    predictions = predRes.data.predictions || [];
  } catch {}
  // Fetch notification preferences
  let notificationPrefs = {};
  try {
    const prefsRes = await axios.get('http://localhost:4200/api/notification-prefs');
    notificationPrefs = prefsRes.data || {};
  } catch {}
  // Fetch notification history
  let notificationHistory = [];
  try {
    const histRes = await axios.get('http://localhost:4200/api/notification-history');
    notificationHistory = histRes.data || [];
  } catch {}
  // SVG chart for percent fixed over time
  let chart = '';
  if (log.length > 1) {
    const points = log.map((s, i) => `${i * 30},${100 - (s.percentFixed || 0)}`).join(' ');
    chart = `<svg width="300" height="100" style="background:#f3f4f6;margin-bottom:10px;"><polyline fill="none" stroke="#4ade80" stroke-width="3" points="${points}" /><text x="10" y="15" font-size="12">% Fixed Over Time</text></svg>`;
  }
  // GitHub Actions status
  let ghStatus = 'Unknown';
  if (fs.existsSync(GITHUB_STATUS_FILE)) {
    try {
      const s = JSON.parse(fs.readFileSync(GITHUB_STATUS_FILE, 'utf-8'));
      ghStatus = `${s.status} (${s.time})`;
    } catch {}
  }
  let table = '';
  if (log.length > 0) {
    table = `<h3>Recent Error/Fix Runs</h3><table border="1" cellpadding="4" style="border-collapse:collapse;"><tr><th>Time</th><th>Found</th><th>Fixed</th><th>Manual</th><th>Remaining</th><th>% Auto Fixed</th><th>% Total Fixed</th><th>Types</th></tr>` +
      log.slice(-10).reverse().map(s => `<tr><td>${s.timestamp}</td><td>${s.errorsFound}</td><td>${s.errorsFixed}</td><td>${s.manualCount}</td><td>${s.remaining}</td><td>${s.percentAutoFixed}%</td><td>${s.percentFixed}%</td><td>${Object.entries(s.errorTypeCounts).map(([t,c])=>`${t}:${c}`).join(', ')}</td></tr>`).join('') + '</table>';
  }
  // Manual errors
  let manualList = '';
  if (stats.manualErrors && stats.manualErrors.length > 0) {
    manualList = `<h3>Manual Errors Requiring Attention</h3><ul>` +
      stats.manualErrors.map(e => `<li><b>${e.type}</b>: ${e.description}<br/><i>${e.manualInstructions}</i></li>`).join('') + '</ul>';
  }
  res.send(`
    <h1>QMOI Dashboard</h1>
    <h2>Error/Fix Stats</h2>
    <ul>
      <li>Total Errors Found: <b>${stats.errorsFound ?? 'N/A'}</b></li>
      <li>Total Fixed: <b>${stats.errorsFixed ?? 'N/A'}</b></li>
      <li>Manual Fixes Needed: <b>${stats.manualCount ?? 0}</b></li>
      <li>Remaining: <b>${stats.remaining ?? 'N/A'}</b></li>
      <li>Percent Auto Fixed: <b>${stats.percentAutoFixed ?? 'N/A'}%</b></li>
      <li>Percent Total Fixed (auto+manual): <b>${stats.percentFixed ?? 'N/A'}%</b></li>
    </ul>
    <div style="width:300px;background:#eee;border-radius:8px;overflow:hidden;margin-bottom:10px;">
      <div style="width:${stats.percentFixed ?? 0}%;background:#4ade80;color:#fff;padding:4px 0;text-align:center;">${stats.percentFixed ?? 0}%</div>
    </div>
    ${chart}
    <h2>AI Error Predictions</h2>
    <ul>
      ${predictions.length === 0 ? '<li>No predictions available</li>' : predictions.map(p => `<li>${p.kind === 'errorType' ? 'Error Type' : 'File'}: <b>${p.type || p.file}</b> (${p.count})</li>`).join('')}
    </ul>
    <h2>Notification Preferences</h2>
    <pre>${JSON.stringify(notificationPrefs, null, 2)}</pre>
    <form method="POST" action="/update-notification-prefs" onsubmit="fetch('/update-notification-prefs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slack:{enabled:true}})}).then(()=>location.reload());return false;">
      <button type="submit">Enable Slack Notifications</button>
    </form>
    <h2>Notification History</h2>
    <ul>
      ${notificationHistory.length === 0 ? '<li>No notifications sent</li>' : notificationHistory.slice(-10).reverse().map(n => `<li>[${n.type}] <b>${n.title}</b> - ${n.status} (${n.timestamp})</li>`).join('')}
    </ul>
    ${manualList}
    <h3>Error Type Breakdown</h3>
    <ul>
      ${(stats.errorTypeCounts ? Object.entries(stats.errorTypeCounts).map(([type, count]) => `<li>${type}: <b>${count}</b></li>`).join('') : 'N/A')}
    </ul>
    <form method="POST" action="/trigger-fix" onsubmit="fetch('/trigger-fix',{method:'POST'}).then(r=>r.json()).then(d=>location.reload());return false;">
      <button type="submit">Trigger Auto-Fix Now</button>
    </form>
    <form method="POST" action="/send-test-notification"><button type="submit">Send Test Notification</button></form>
    <h3>GitHub Actions Status: <span style="color:#2563eb">${ghStatus}</span></h3>
    <a href="/logs">View Orchestrator Logs</a>
    ${table}
  `);
});

// Add endpoint to update notification preferences
app.post('/update-notification-prefs', express.json(), async (req, res) => {
  try {
    await axios.post('http://localhost:4200/api/notification-prefs', req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.toString() });
  }
});

// API endpoints
app.get('/api/error-fix-log', (req, res) => {
  if (!fs.existsSync(ERROR_FIX_LOG)) return res.json([]);
  res.json(JSON.parse(fs.readFileSync(ERROR_FIX_LOG, 'utf-8')));
});
app.get('/api/logs', (req, res) => {
  if (!fs.existsSync(LOG_FILE)) return res.send('');
  res.type('text/plain').send(fs.readFileSync(LOG_FILE, 'utf-8'));
});
app.post('/api/trigger-fix', (req, res) => {
  try {
    execSync('node ./scripts/enhanced-error-fix.js');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.toString() });
  }
});

app.listen(4000, () => console.log('QMOI Dashboard running on http://localhost:4000')); 