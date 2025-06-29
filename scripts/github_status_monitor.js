const fetch = require('node-fetch');
const { sendEmail, sendSlack, sendWhatsApp } = require('./qmoi_notifier');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPO || 'thealphakenya/Alpha-Q-ai';

async function checkWorkflowStatus() {
  const res = await fetch(`https://api.github.com/repos/${REPO}/actions/runs?per_page=1`, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` }
  });
  const data = await res.json();
  const latest = data.workflow_runs[0];
  if (latest.conclusion !== 'success') {
    const msg = `QMOI: Latest GitHub Actions run failed! Status: ${latest.conclusion}\nURL: ${latest.html_url}`;
    await sendEmail('QMOI GitHub Actions Failure', msg);
    await sendSlack(msg);
    await sendWhatsApp(msg);
    // Optionally: trigger local fix here
  } else {
    console.log('Latest GitHub Actions run succeeded.');
  }
}
checkWorkflowStatus(); 