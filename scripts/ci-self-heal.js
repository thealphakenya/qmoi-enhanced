#!/usr/bin/env node
// QMOI CI/CD Self-Healing Script for GitLab
// Fetches latest failed job log, detects/fixes typos in .gitlab-ci.yml, commits, pushes, triggers new pipeline, logs actions.

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import fetch from 'node-fetch';
import yaml from 'js-yaml';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import QMOINotificationSystem from './qmoi-notification-system';
const notifier = new QMOINotificationSystem();

const GITLAB_TOKEN = process.env.GITLAB_TOKEN;
const GITLAB_PROJECT_ID = process.env.GITLAB_PROJECT_ID;
const GITLAB_API_URL = process.env.GITLAB_API_URL || 'https://gitlab.com/api/v4';
const LOG_FILE = path.resolve(__dirname, '../logs/ci-self-heal.log');
const CI_FILE = path.resolve(__dirname, '../.gitlab-ci.yml');

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const PERSISTENT_ERROR_FILE = path.resolve(__dirname, '../logs/ci-self-heal-persistent.json');
const PERSISTENT_THRESHOLD = parseInt(process.env.PERSISTENT_FAIL_THRESHOLD || '2', 10); // Notify after N repeats

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;
const VERCEL_API_URL = 'https://api.vercel.com';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY; // e.g. owner/repo
const GITHUB_API_URL = 'https://api.github.com';

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(LOG_FILE, line);
  console.log(line);
}

function getClosestMatch(word, candidates) {
  // Simple Levenshtein distance for fuzzy matching
  function levenshtein(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        matrix[i][j] = a[i - 1] === b[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
    return matrix[a.length][b.length];
  }
  let minDist = Infinity, best = null;
  for (const c of candidates) {
    const dist = levenshtein(word, c);
    if (dist < minDist) {
      minDist = dist;
      best = c;
    }
  }
  return minDist <= 2 ? best : null; // Only fix if typo is small
}

async function fetchLatestFailedJob() {
  const url = `${GITLAB_API_URL}/projects/${encodeURIComponent(GITLAB_PROJECT_ID)}/pipelines?status=failed&per_page=1`;
  const resp = await fetch(url, {
    headers: { 'PRIVATE-TOKEN': GITLAB_TOKEN }
  });
  const pipelines = await resp.json();
  if (!pipelines.length) return null;
  const pipelineId = pipelines[0].id;
  const jobsUrl = `${GITLAB_API_URL}/projects/${encodeURIComponent(GITLAB_PROJECT_ID)}/pipelines/${pipelineId}/jobs`;
  const jobsResp = await fetch(jobsUrl, { headers: { 'PRIVATE-TOKEN': GITLAB_TOKEN } });
  const jobs = await jobsResp.json();
  const failedJob = jobs.find(j => j.status === 'failed');
  if (!failedJob) return null;
  const logUrl = `${GITLAB_API_URL}/projects/${encodeURIComponent(GITLAB_PROJECT_ID)}/jobs/${failedJob.id}/trace`;
  const logResp = await fetch(logUrl, { headers: { 'PRIVATE-TOKEN': GITLAB_TOKEN } });
  const logText = await logResp.text();
  return { log: logText, job: failedJob };
}

async function fetchVercelLatestFailedDeployment() {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    log('Missing VERCEL_TOKEN or VERCEL_PROJECT_ID for Vercel API.');
    return null;
  }
  let url = `${VERCEL_API_URL}/v6/deployments?projectId=${VERCEL_PROJECT_ID}&limit=5`;
  if (VERCEL_TEAM_ID) url += `&teamId=${VERCEL_TEAM_ID}`;
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
  });
  const data = await resp.json();
  if (!data.deployments) return null;
  const failed = data.deployments.find(d => d.state === 'ERROR');
  if (!failed) return null;
  // Fetch deployment log
  const logUrl = `${VERCEL_API_URL}/v2/deployments/${failed.uid}/events` + (VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : '');
  const logResp = await fetch(logUrl, { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } });
  const logData = await logResp.json();
  const logText = logData.events ? logData.events.map(e => e.payload && e.payload.text ? e.payload.text : '').join('\n') : '';
  return { log: logText, job: { url: `https://vercel.com/${failed.url}` } };
}

async function triggerVercelRedeploy() {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    log('Missing VERCEL_TOKEN or VERCEL_PROJECT_ID for Vercel redeploy.');
    return;
  }
  let url = `${VERCEL_API_URL}/v13/deployments`; // v13 for new deploy
  if (VERCEL_TEAM_ID) url += `?teamId=${VERCEL_TEAM_ID}`;
  const body = { projectId: VERCEL_PROJECT_ID };
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (resp.ok) {
    log('Triggered Vercel redeploy.');
  } else {
    log('Failed to trigger Vercel redeploy: ' + (await resp.text()));
  }
}

async function fetchGithubLatestFailedWorkflow() {
  if (!GITHUB_TOKEN || !GITHUB_REPOSITORY) {
    log('Missing GITHUB_TOKEN or GITHUB_REPOSITORY for GitHub API.');
    return null;
  }
  // Get latest failed workflow run
  const url = `${GITHUB_API_URL}/repos/${GITHUB_REPOSITORY}/actions/runs?status=failure&per_page=1`;
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github+json' }
  });
  const data = await resp.json();
  if (!data.workflow_runs || !data.workflow_runs.length) return null;
  const run = data.workflow_runs[0];
  // Get logs for the failed run
  const logsUrl = `${GITHUB_API_URL}/repos/${GITHUB_REPOSITORY}/actions/runs/${run.id}/logs`;
  const logsResp = await fetch(logsUrl, { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } });
  if (!logsResp.ok) {
    log('Failed to fetch GitHub Actions logs.');
    return null;
  }
  // GitHub returns a zip file for logs; for now, just note the log URL
  // (Future: download and parse zip for more granular error detection)
  const logText = `See logs: ${logsUrl}`;
  return { log: logText, job: { html_url: run.html_url } };
}

async function triggerGithubWorkflowRerun() {
  if (!GITHUB_TOKEN || !GITHUB_REPOSITORY) {
    log('Missing GITHUB_TOKEN or GITHUB_REPOSITORY for GitHub workflow re-run.');
    return;
  }
  // Get latest failed workflow run
  const url = `${GITHUB_API_URL}/repos/${GITHUB_REPOSITORY}/actions/runs?status=failure&per_page=1`;
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github+json' }
  });
  const data = await resp.json();
  if (!data.workflow_runs || !data.workflow_runs.length) return;
  const run = data.workflow_runs[0];
  // Re-run the workflow
  const rerunUrl = `${GITHUB_API_URL}/repos/${GITHUB_REPOSITORY}/actions/runs/${run.id}/rerun`;
  const rerunResp = await fetch(rerunUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github+json' }
  });
  if (rerunResp.ok) {
    log('Triggered GitHub Actions workflow re-run.');
  } else {
    log('Failed to trigger GitHub Actions workflow re-run: ' + (await rerunResp.text()));
  }
}

function findAndFixTypoInCI(logText) {
  // Look for 'No such file or directory' or 'command not found' with a path
  const regex = /(node|bash|sh)\s+([^\s]+):?\s*(No such file|command not found)/i;
  const match = logText.match(regex);
  if (!match) return false;
  const badPath = match[2];
  log(`Detected possible typo: ${badPath}`);
  // List all files in likely directories
  const dirs = ['scripts', 'sucripts', 'script', 'sucript'];
  let candidates = [];
  for (const d of dirs) {
    const dirPath = path.resolve(__dirname, '../', d);
    if (fs.existsSync(dirPath)) {
      candidates = candidates.concat(fs.readdirSync(dirPath).map(f => `${d}/${f}`));
    }
  }
  // Try to find the closest match
  const base = badPath.split('/').pop();
  const best = getClosestMatch(badPath, candidates);
  if (!best) {
    log('No close match found for typo.');
    return false;
  }
  // Patch .gitlab-ci.yml
  let ciText = fs.readFileSync(CI_FILE, 'utf8');
  if (!ciText.includes(badPath)) {
    log('Typo not found in .gitlab-ci.yml');
    return false;
  }
  ciText = ciText.replace(new RegExp(badPath, 'g'), best);
  fs.writeFileSync(CI_FILE, ciText);
  log(`Fixed typo: replaced ${badPath} with ${best} in .gitlab-ci.yml`);
  return true;
}

function commitAndPushFix() {
  try {
    execSync('git config user.name "qmoi-bot"');
    execSync('git config user.email "qmoi-bot@example.com"');
    execSync('git add .gitlab-ci.yml');
    execSync('git commit -m "ci(self-heal): auto-fix typo in .gitlab-ci.yml [bot]"');
    execSync('git push');
    log('Committed and pushed fix.');
  } catch (e) {
    log('Error committing/pushing fix: ' + e.message);
  }
}

async function triggerPipeline() {
  const url = `${GITLAB_API_URL}/projects/${encodeURIComponent(GITLAB_PROJECT_ID)}/trigger/pipeline`;
  // This requires a trigger token set as env var GITLAB_TRIGGER_TOKEN
  const token = process.env.GITLAB_TRIGGER_TOKEN;
  if (!token) {
    log('No GITLAB_TRIGGER_TOKEN set, skipping pipeline trigger.');
    return;
  }
  const ref = process.env.CI_COMMIT_REF_NAME || 'main';
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, ref })
  });
  if (resp.ok) {
    log('Triggered new pipeline.');
  } else {
    log('Failed to trigger pipeline: ' + (await resp.text()));
  }
}

// --- ENHANCEMENT: Auto-set env vars and expand error pattern recognition ---
const ENV_FILE = path.resolve(__dirname, '../.env');

function setEnvVar(key, value) {
  // Set in process.env and .env file if not already set
  if (!process.env[key]) {
    process.env[key] = value;
    let envText = '';
    if (fs.existsSync(ENV_FILE)) {
      envText = fs.readFileSync(ENV_FILE, 'utf8');
    }
    if (!envText.includes(`${key}=`)) {
      envText += `\n${key}=${value}`;
      fs.writeFileSync(ENV_FILE, envText);
      log(`Set ${key} in .env file.`);
    }
  }
}

function autoSetRequiredEnvVars() {
  // Try to set required env vars if missing
  let changed = false;
  if (!process.env.GITLAB_TOKEN && process.env.LOCAL_GITLAB_TOKEN) {
    setEnvVar('GITLAB_TOKEN', process.env.LOCAL_GITLAB_TOKEN);
    changed = true;
  }
  if (!process.env.GITLAB_PROJECT_ID && process.env.LOCAL_GITLAB_PROJECT_ID) {
    setEnvVar('GITLAB_PROJECT_ID', process.env.LOCAL_GITLAB_PROJECT_ID);
    changed = true;
  }
  if (!process.env.GITLAB_TRIGGER_TOKEN && process.env.LOCAL_GITLAB_TRIGGER_TOKEN) {
    setEnvVar('GITLAB_TRIGGER_TOKEN', process.env.LOCAL_GITLAB_TRIGGER_TOKEN);
    changed = true;
  }
  if (changed) log('Auto-set missing required env vars.');
  // For CI/CD, could use GitLab API to set project variables if token is available (future enhancement)
}

// Enhanced error patterns
const ERROR_PATTERNS = [
  {
    regex: /(node|bash|sh)\s+([^\s]+):?\s*(No such file|command not found)/i,
    desc: 'Script/command not found',
    fix: findAndFixTypoInCI
  },
  {
    regex: /YAMLException|yaml: (.*error.*)/i,
    desc: 'YAML syntax error',
    fix: function(logText) {
      log('Detected YAML syntax error. Please check .gitlab-ci.yml for syntax issues.');
      // Could auto-lint/fix YAML in future
      return false;
    }
  },
  {
    regex: /Cannot find module '([^']+)'/i,
    desc: 'Missing Node.js dependency',
    fix: function(logText, match) {
      const dep = match[1];
      log(`Detected missing dependency: ${dep}. Installing...`);
      try {
        execSync(`npm install ${dep}`);
        log(`Installed missing dependency: ${dep}`);
        return true;
      } catch (e) {
        log(`Failed to install dependency: ${dep}`);
        return false;
      }
    }
  },
  {
    regex: /Permission denied|EACCES/i,
    desc: 'Permission error',
    fix: function(logText) {
      log('Detected permission error. Please check file permissions in CI/CD.');
      return false;
    }
  },
  {
    regex: /rate limit|API rate limit exceeded/i,
    desc: 'API rate limit',
    fix: function(logText) {
      log('Detected API rate limit. Consider increasing API quota or adding retry logic.');
      return false;
    }
  }
];

function enhancedErrorRecognition(logText) {
  let fixed = false;
  for (const pattern of ERROR_PATTERNS) {
    const match = logText.match(pattern.regex);
    if (match) {
      log(`Matched error pattern: ${pattern.desc}`);
      fixed = pattern.fix(logText, match) || fixed;
    }
  }
  if (!fixed) {
    log('Unrecognized error. Logging for future learning.');
    fs.appendFileSync(LOG_FILE, `\n[UNRECOGNIZED ERROR]\n${logText}\n`);
  }
  return fixed;
}

function hashError(logText) {
  return crypto.createHash('sha256').update(logText).digest('hex');
}

function loadPersistentError() {
  if (fs.existsSync(PERSISTENT_ERROR_FILE)) {
    return JSON.parse(fs.readFileSync(PERSISTENT_ERROR_FILE, 'utf8'));
  }
  return { lastHash: '', count: 0 };
}

function savePersistentError(hash, count) {
  fs.writeFileSync(PERSISTENT_ERROR_FILE, JSON.stringify({ lastHash: hash, count }));
}

async function sendSlackNotification(message) {
  if (!SLACK_WEBHOOK_URL) return;
  try {
    await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message })
    });
    log('Sent Slack notification.');
  } catch (e) {
    log('Failed to send Slack notification: ' + e.message);
  }
}

async function sendEmailNotification(subject, message) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_TO, EMAIL_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !EMAIL_TO || !EMAIL_FROM) return;
  try {
    let transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT, 10),
      secure: parseInt(SMTP_PORT, 10) === 465, // true for 465, false for other ports
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    });
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject,
      text: message
    });
    log('Sent email notification.');
  } catch (e) {
    log('Failed to send email notification: ' + e.message);
  }
}

async function notifyPersistentFailure(logText, pipelineUrl) {
  const msg = `QMOI CI/CD persistent failure detected!\n\nError:\n${logText.slice(0, 500)}\n...\nPipeline: ${pipelineUrl}`;
  await sendSlackNotification(msg);
  await sendEmailNotification('QMOI CI/CD Persistent Failure', msg);
}

// --- Cross-platform abstraction ---
const PLATFORM = process.env.QMOI_CI_PLATFORM || detectPlatform();

function detectPlatform() {
  if (process.env.GITHUB_ACTIONS) return 'github';
  if (process.env.GITLAB_CI) return 'gitlab';
  if (process.env.VERCEL) return 'vercel';
  return 'unknown';
}

// Platform-specific API wrappers
const platformAPI = {
  gitlab: {
    fetchLatestFailedJob: fetchLatestFailedJob, // already implemented
    triggerPipeline: triggerPipeline, // already implemented
    getPipelineUrl: job => job && job.web_url ? job.web_url : 'N/A',
    setEnvVar: setEnvVar // fallback to .env for now
  },
  github: {
    fetchLatestFailedJob: fetchGithubLatestFailedWorkflow,
    triggerPipeline: triggerGithubWorkflowRerun,
    getPipelineUrl: job => job && job.html_url ? job.html_url : 'N/A',
    setEnvVar: setEnvVar // fallback to .env for now
  },
  vercel: {
    fetchLatestFailedJob: fetchVercelLatestFailedDeployment,
    triggerPipeline: triggerVercelRedeploy,
    getPipelineUrl: job => job && job.url ? job.url : 'N/A',
    setEnvVar: setEnvVar // fallback to .env for now
  }
};

(async () => {
  await notifier.sendNotification('email', 'QMOI Self-Heal Started', 'Self-healing process has started.');
  log('--- QMOI CI/CD Self-Heal Start ---');
  autoSetRequiredEnvVars();
  const api = platformAPI[PLATFORM] || platformAPI.gitlab;
  if (PLATFORM === 'unknown') {
    log('Unknown CI/CD platform. Exiting.');
    await notifier.sendNotification('email', 'QMOI Self-Heal Error', 'Unknown CI/CD platform. Exiting.');
    process.exit(1);
  }
  // Platform-specific required env check
  if (PLATFORM === 'gitlab' && (!GITLAB_TOKEN || !GITLAB_PROJECT_ID)) {
    log('Missing GITLAB_TOKEN or GITLAB_PROJECT_ID env vars. Exiting.');
    await notifier.sendNotification('email', 'QMOI Self-Heal Error', 'Missing GITLAB_TOKEN or GITLAB_PROJECT_ID env vars. Exiting.');
    process.exit(1);
  }
  // Fetch failed job
  const result = await api.fetchLatestFailedJob();
  if (!result) {
    log('No failed jobs found. Exiting.');
    await notifier.sendNotification('email', 'QMOI Self-Heal Complete', 'No failed jobs found. Exiting.');
    process.exit(0);
  }
  const { log: jobLog, job } = result;
  const fixed = enhancedErrorRecognition(jobLog);
  // Persistent failure tracking
  const hash = hashError(jobLog);
  let { lastHash, count } = loadPersistentError();
  if (hash === lastHash) {
    count++;
  } else {
    count = 1;
    lastHash = hash;
  }
  savePersistentError(hash, count);
  if (!fixed && count >= PERSISTENT_THRESHOLD) {
    const pipelineUrl = api.getPipelineUrl(job);
    await notifier.sendNotification('email', 'QMOI Persistent Failure', `Persistent failure detected. Error: ${jobLog.slice(0, 500)}...\nPipeline: ${pipelineUrl}`);
    await notifyPersistentFailure(jobLog, pipelineUrl);
  }
  if (fixed) {
    await notifier.sendNotification('email', 'QMOI Fix Applied', 'A fix was detected and applied. Committing and pushing fix, triggering redeploy.');
    commitAndPushFix();
    await api.triggerPipeline();
    await notifier.sendNotification('email', 'QMOI Redeploy Triggered', 'Redeploy/workflow rerun triggered after fix.');
    // Reset persistent error counter on fix
    savePersistentError('', 0);
  } else {
    log('No fix applied.');
    await notifier.sendNotification('email', 'QMOI No Fix Applied', 'No fix was applied for the detected error.');
  }
  log('--- QMOI CI/CD Self-Heal End ---');
  await notifier.sendNotification('email', 'QMOI Self-Heal End', 'Self-healing process has ended.');
})(); 