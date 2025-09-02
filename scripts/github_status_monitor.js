const fetch = require('node-fetch');
const fs = require('fs');
const { sendEmail, sendSlack, sendWhatsApp } = require('./qmoi_notifier');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPO || 'thealphakenya/Alpha-Q-ai';
const DASHBOARD_URL = process.env.QMOI_DASHBOARD_URL || 'http://localhost:4000/trigger-fix';
const STATUS_FILE = './logs/github_status.json';

async function checkWorkflowStatus() {
  const res = await fetch(`https://api.github.com/repos/${REPO}/actions/runs?per_page=1`, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` }
  });
  const data = await res.json();
  const latest = data.workflow_runs[0];
  const status = latest.conclusion;
  const time = new Date().toISOString();
  fs.writeFileSync(STATUS_FILE, JSON.stringify({ status, time }, null, 2));
  if (status !== 'success') {
    const msg = `QMOI: Latest GitHub Actions run failed! Status: ${status}\nURL: ${latest.html_url}`;
    await sendEmail('QMOI GitHub Actions Failure', msg);
    await sendSlack(msg);
    await sendWhatsApp(msg);
    // Auto-trigger local fix
    try {
      await fetch(DASHBOARD_URL, { method: 'POST' });
      fs.appendFileSync(STATUS_FILE, `\nTriggered local fix at ${time}`);
    } catch (err) {
      fs.appendFileSync(STATUS_FILE, `\nFailed to trigger local fix: ${err}`);
    }
  } else {
    console.log('Latest GitHub Actions run succeeded.');
  }
}
checkWorkflowStatus(); 