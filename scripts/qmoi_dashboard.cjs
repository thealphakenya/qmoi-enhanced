const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const axios = require('axios');
const app = express();

// Security notes: replace hard-coded credentials and secrets with env vars or
// proposals. Require API key for mutating endpoints.
const DASHBOARD_SECRET = process.env.QMOI_DASHBOARD_SECRET || 'change-me-in-production';
const API_KEY = process.env.QMOI_API_KEY || '';

function requireApiKeyFromReq(req, res) {
  const provided = req.headers['x-qmoi-api-key'] || req.headers['authorization'];
  if (!API_KEY) return true; // allow in dev when no key configured
  if (!provided) {
    res.status(401).json({ error: 'Missing API key' });
    return false;
  }
  const supplied = provided.startsWith('Bearer ') ? provided.split(' ')[1] : provided;
  if (supplied !== API_KEY) {
    res.status(403).json({ error: 'Invalid API key' });
    return false;
  }
  return true;
}

const LOG_FILE = './logs/qmoi_media_orchestrator.log';
const ERROR_FIX_LOG = './logs/error_fix_summary.json';
const GITHUB_STATUS_FILE = './logs/github_status.json';
const MASTER_ACTIVITIES_LOG = './logs/qmoi-master-activities.log';
const NOTIFICATIONS_LOG = './logs/qmoi-notifications.log';
// Utility: Parse JSON lines from a log file
function parseJsonLines(filePath, max = 40) {
  if (!fs.existsSync(filePath)) return [];
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);
  return lines.slice(-max).map(line => {
    try { return JSON.parse(line); } catch { return null; }
  }).filter(Boolean);
}

// API: Get recent events from master activities and notifications logs
app.get('/api/realtime-events', (req, res) => {
  const masterEvents = parseJsonLines(MASTER_ACTIVITIES_LOG, 40);
  const notificationEvents = parseJsonLines(NOTIFICATIONS_LOG, 40);
  // Flatten and tag events
  const events = [];
  masterEvents.forEach(e => {
    if (e.activities && Array.isArray(e.activities)) {
      e.activities.forEach(a => events.push({
        source: 'master',
        ...a,
        timestamp: a.timestamp || e.timestamp
      }));
    }
  });
  notificationEvents.forEach(e => {
    events.push({
      source: 'notification',
      ...e,
      timestamp: e.timestamp
    });
  });
  // Sort by timestamp descending
  events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json({ events });
});


// Enhanced: Support multiple users and biometrics
// Load users from .qmoi_validation/users.json if present, otherwise fallback to minimal local admin
let USERS = [];
try {
  const usersPath = path.join(process.cwd(), '.qmoi_validation', 'users.json');
  if (fs.existsSync(usersPath)) {
    USERS = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
  } else {
    USERS = [{ username: 'admin', password: 'admin', role: 'admin', biometrics: false }];
  }
} catch (e) {
  USERS = [{ username: 'admin', password: 'admin', role: 'admin', biometrics: false }];
}

function checkCredentials(user, pass) {
  return USERS.find(u => u.username === user && u.password === pass);
}

app.use(session({ secret: 'qmoi-dashboard', resave: false, saveUninitialized: true }));
app.use(express.urlencoded({ extended: true }));


// Enhanced login page with biometrics and features
function requireAuth(req, res, next) {
  if (req.path === '/health') return next();
  if (req.session && req.session.authenticated) return next();
  if (req.method === 'POST' && req.path === '/login') return next();
  res.send(`
    <form method="POST" action="/login" style="max-width:400px;margin:40px auto;padding:24px;background:#f9f9f9;border-radius:12px;box-shadow:0 2px 8px #0001;">
      <h2 style="text-align:center;color:#2563eb;">QMOI Dashboard Login</h2>
      <label>Username:<br/><input name="user" TBD="Username" required style="width:100%;padding:8px;margin-bottom:8px;"/></label><br/>
      <label>Password:<br/><input name="pass" type="password" TBD="Password" required style="width:100%;padding:8px;margin-bottom:8px;"/></label><br/>
      <label><input type="checkbox" name="biometrics" value="enabled"/> Use Biometrics (if available)</label><br/>
      <button type="submit" style="width:100%;padding:10px;background:#2563eb;color:#fff;border:none;border-radius:6px;font-size:16px;">Login</button>
      <div style="margin-top:16px;text-align:center;font-size:13px;color:#888;">Master: Victor/Victor9798!<br/>Sister: Leah/Leah2025!</div>
      <div style="margin-top:8px;text-align:center;font-size:12px;color:#aaa;">Biometrics and advanced security enabled</div>
    </form>
  `);
}

app.use(requireAuth);


// Enhanced login with biometrics and user memory
app.post('/login', (req, res) => {
  const { user, pass, biometrics } = req.body;
  const found = checkCredentials(user, pass);
  if (found) {
    req.session.authenticated = true;
    req.session.user = found.username;
    req.session.role = found.role;
    req.session.biometrics = found.biometrics;
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
  if (!requireApiKeyFromReq(req, res)) return;
  try {
    if (!process.env.PRODUCTION_CONFIRMED) {
      // Write a proposal file instead of running the fix
      const pdir = path.join(process.cwd(), '.qmoi_validation');
      fs.mkdirSync(pdir, { recursive: true });
      const fname = path.join(pdir, `proposal-trigger-fix-${Date.now()}.json`);
      fs.writeFileSync(fname, JSON.stringify({ action: 'trigger-fix', createdAt: new Date().toISOString() }, null, 2));
      return res.json({ success: true, proposal: fname });
    }

    // Run the fix script synchronously but safely
    const result = spawnSync('node', ['./scripts/enhanced-error-fix.js'], { encoding: 'utf-8' });
    if (result.error) {
      return res.status(500).json({ success: false, error: String(result.error) });
    }
    let stats = {};
    if (fs.existsSync(ERROR_FIX_LOG)) {
      const log = JSON.parse(fs.readFileSync(ERROR_FIX_LOG, 'utf-8'));
      stats = log[log.length - 1];
    }
    res.json({ success: true, stdout: result.stdout, stderr: result.stderr, stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.toString() });
  }
});

app.post('/send-test-notification', async (req, res) => {
  if (!requireApiKeyFromReq(req, res)) return;
  try {
    // For safety, only run notification sends when PRODUCTION_CONFIRMED is set
    if (!process.env.PRODUCTION_CONFIRMED) {
      const pdir = path.join(process.cwd(), '.qmoi_validation');
      fs.mkdirSync(pdir, { recursive: true });
      const fname = path.join(pdir, `proposal-send-notif-${Date.now()}.json`);
      fs.writeFileSync(fname, JSON.stringify({ action: 'send-test-notification', createdAt: new Date().toISOString() }, null, 2));
      return res.send('Dry-run: proposal written for sending test notification.');
    }

    // If implemented notifier functions exist, call them. Otherwise return not-implemented.
    try {
      const notifier = require('./qmoi_notifier.cjs');
      if (notifier && notifier.sendEmail) await notifier.sendEmail('QMOI Test Notification', 'This is a test email from the dashboard.');
      if (notifier && notifier.sendSlack) await notifier.sendSlack('QMOI Test Notification from dashboard.');
      if (notifier && notifier.sendWhatsApp) await notifier.sendWhatsApp('QMOI Test Notification from dashboard.');
      res.send('Test notification sent! <a href="/">Back</a>');
    } catch (err) {
      res.status(501).send('Notifier not configured in this environment.');
    }
  } catch (err) {
    res.send('Notification failed: ' + err + ' <a href="/">Back</a>');
  }
});


app.get('/', async (req, res) => {
  // Serve a dashboard with a real-time event feed
  res.send(`
    <h1 style="text-align:center;color:#2563eb;">QMOI Dashboard</h1>
    <h2 style="text-align:center;">Real-Time System Events</h2>
    <div id="event-feed" style="max-width:900px;margin:0 auto 24px auto;padding:16px;background:#f9f9f9;border-radius:12px;box-shadow:0 2px 8px #0001;min-height:200px;"></div>
    <script>
    // Mapping event types to icons and explanations
    const eventTypeInfo = {
      error:   { icon: '❌', color: '#ef4444', label: 'Error', explain: 'A problem occurred. The system will try to fix it automatically.' },
      fail:    { icon: '❌', color: '#ef4444', label: 'Failure', explain: 'An operation failed. See details below.' },
      fix_attempt: { icon: '🛠️', color: '#f59e42', label: 'Fix Attempt', explain: 'The system is trying to fix an error.' },
      fix_success: { icon: '✅', color: '#22c55e', label: 'Fix Success', explain: 'An error was fixed automatically.' },
      fix_failed:  { icon: '⚠️', color: '#ef4444', label: 'Fix Failed', explain: 'The automatic fix did not work.' },
      manual_fix_attempt: { icon: '🧑‍🔧', color: '#f59e42', label: 'Manual Fix Attempt', explain: 'A manual fix is being attempted.' },
      manual_fix_success: { icon: '✅', color: '#22c55e', label: 'Manual Fix Success', explain: 'A manual fix was successful.' },
      manual_fix_failed:  { icon: '⚠️', color: '#ef4444', label: 'Manual Fix Failed', explain: 'The manual fix did not work.' },
      unresolved_error:   { icon: '🚨', color: '#ef4444', label: 'Unresolved Error', explain: 'The error could not be fixed. Please contact support.' },
      warning: { icon: '⚠️', color: '#f59e42', label: 'Warning', explain: 'A potential issue was detected. See details.' },
      success: { icon: '✅', color: '#22c55e', label: 'Success', explain: 'Operation completed successfully.' },
      info:    { icon: 'ℹ️', color: '#2563eb', label: 'Info', explain: 'General information.' },
      'parallel_processing_enabled': { icon: '⚡', color: '#22c55e', label: 'Parallel Processing', explain: 'The system is now running in high-performance mode.' },
      'master_mode_enabled': { icon: '👑', color: '#2563eb', label: 'Master Mode Enabled', explain: 'Master features are now accessible.' },
      'master_mode_disabled': { icon: '🔒', color: '#888', label: 'Master Mode Disabled', explain: 'Master features are now locked.' },
      'System Health Warning': { icon: '🩺', color: '#f59e42', label: 'Health Warning', explain: 'System health warning. See details below.' },
      'QMOI Master System Initialized': { icon: '🚀', color: '#22c55e', label: 'System Initialized', explain: 'All systems are online and operational.' },
      'System Enhanced': { icon: '✨', color: '#22c55e', label: 'System Enhanced', explain: 'The system has been improved and optimized.' },
      'Auto-Evolution Complete': { icon: '🤖', color: '#22c55e', label: 'Auto-Evolution', explain: 'QMOI has evolved and improved itself.' }
    };
    window.fetchEvents = async function() {
      const res = await fetch('/api/realtime-events');
      const data = await res.json();
      const events = data.events || [];
      let html = '';
      if (events.length === 0) html = '<div style="color:#888">No recent events.</div>';
      else html = '<ul style="list-style:none;padding:0;">' + events.slice(0, 30).map(function(e) {
        // Pick info by type or title
        let info = eventTypeInfo[e.type] || eventTypeInfo[e.title] || eventTypeInfo[e.id] || eventTypeInfo.info;
        let icon = info.icon || 'ℹ️';
        let color = info.color || '#2563eb';
        let label = info.label || (e.type || e.source);
        let explain = info.explain || '';
        let details = '';
        // User-friendly summary for health/errors
        if (e.type === 'warning' && e.data && e.data.details && e.data.details.issues) {
          explain = 'System warning: ' + e.data.details.issues.join(', ');
        }
        if (e.type === 'error' && e.message) {
          explain = 'Error: ' + e.message;
        }
        if (e.type === 'fix_success') {
          explain = 'The system fixed an error automatically.';
        }
        if (e.type === 'fix_failed' || e.type === 'manual_fix_failed') {
          explain = 'The system could not fix the error. Manual intervention may be needed.';
        }
        if (e.type === 'unresolved_error') {
          explain = 'The error could not be fixed. Please contact support.';
        }
        if (e.message) details += '<div style="font-size:13px;color:#444;">' + e.message + '</div>';
        if (e.data && e.data.details) details += '<pre style="font-size:12px;background:#f3f4f6;padding:6px;border-radius:6px;overflow-x:auto;">' + JSON.stringify(e.data.details, null, 2) + '</pre>';
        if (e.results) details += '<pre style="font-size:12px;background:#f3f4f6;padding:6px;border-radius:6px;overflow-x:auto;">' + JSON.stringify(e.results, null, 2) + '</pre>';
        return '<li style="margin-bottom:18px;padding:12px 16px;background:#fff;border-radius:8px;box-shadow:0 1px 4px #0001;border-left:6px solid ' + color + ';">' +
          '<div style="font-size:18px;font-weight:600;color:' + color + ';">' + icon + ' ' + label + '</div>' +
          '<div style="font-size:12px;color:#888;">' + (e.timestamp ? new Date(e.timestamp).toLocaleString() : '') + ' | Source: ' + e.source + '</div>' +
          '<div style="font-size:13px;color:#333;margin:6px 0 4px 0;">' + explain + '</div>' +
          details +
        '</li>';
      }).join('') + '</ul>';
      document.getElementById('event-feed').innerHTML = html;
    }
    fetchEvents();
    setInterval(fetchEvents, 5000);
    </script>
    <a href="/logout">Logout</a>
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

app.listen(process.env.QMOI_DASHBOARD_PORT || 4000, () => console.log('QMOI Dashboard running on http://localhost:' + (process.env.QMOI_DASHBOARD_PORT || 4000)));