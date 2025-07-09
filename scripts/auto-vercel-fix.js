// scripts/auto-vercel-fix.js
const fetch = require('node-fetch');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT = process.env.VERCEL_PROJECT || 'alpha-q-ai'; // fallback to repo name
const VERCEL_TEAM = process.env.VERCEL_TEAM; // optional

if (!VERCEL_TOKEN) {
  console.error('Missing VERCEL_TOKEN in environment.');
  process.exit(1);
}

const API_BASE = 'https://api.vercel.com';

async function getLatestDeployment() {
  let url = `${API_BASE}/v6/deployments?project=${VERCEL_PROJECT}&limit=1`;
  if (VERCEL_TEAM) url += `&teamId=${VERCEL_TEAM}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch deployments: ${res.statusText}`);
  const data = await res.json();
  return data.deployments && data.deployments[0];
}

async function getDeploymentLogs(deploymentId) {
  let url = `${API_BASE}/v2/deployments/${deploymentId}/events`;
  if (VERCEL_TEAM) url += `?teamId=${VERCEL_TEAM}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch logs: ${res.statusText}`);
  const data = await res.json();
  return data.events || [];
}

// --- Error Pattern Recognition and Auto-Fix Mapping ---

const MAX_RETRIES = parseInt(process.env.MAX_RETRIES, 10) || 5;
const WAIT_INTERVAL = parseInt(process.env.WAIT_INTERVAL, 10) || 60000;

const ERROR_PATTERNS = [
  {
    name: 'ESLintError',
    pattern: /Invalid option '--ext'|ESLintError|Parsing error|Failed to load plugin|Cannot find module 'eslint'/i,
    fix: () => 'npm run lint:fix',
    description: 'Run ESLint auto-fix.'
  },
  {
    name: 'MissingDependency',
    pattern: /Cannot find module '(.*?)'|Error: Cannot find package '(.*?)'/i,
    fix: (match) => `npm install ${match[1] || match[2]}`,
    description: 'Install missing dependency.'
  },
  {
    name: 'ConfigError',
    pattern: /Error:.*(config|configuration|vercel\.json|package\.json|tsconfig\.json)/i,
    fix: () => 'npm run qmoi:fix:comprehensive',
    description: 'Run comprehensive config fix.'
  },
  {
    name: 'BuildScriptError',
    pattern: /npm ERR! missing script: (\w+)/i,
    fix: (match) => `Add missing script: ${match[1]}`,
    description: 'Add missing npm script.'
  },
  {
    name: 'TypeScriptError',
    pattern: /TS\d{4}:/i,
    fix: () => 'npm run type-check',
    description: 'Run TypeScript type check.'
  },
  {
    name: 'NextJSError',
    pattern: /Error:.*next|Module not found: Can't resolve 'next'|Cannot find module 'next'/i,
    fix: () => 'npm install next',
    description: 'Install Next.js dependency.'
  },
  {
    name: 'NodeError',
    pattern: /Error: Cannot find module '(.*?)'|MODULE_NOT_FOUND/i,
    fix: (match) => `npm install ${match[1] || ''}`.trim(),
    description: 'Install missing Node.js module.'
  },
  // Add more patterns as needed
];

function scanLogsForErrors(logs) {
  for (const event of logs) {
    if (!event || !event.text) continue;
    for (const patternObj of ERROR_PATTERNS) {
      const match = event.text.match(patternObj.pattern);
      if (match) {
        return {
          errorType: patternObj.name,
          errorText: event.text,
          fix: typeof patternObj.fix === 'function' ? patternObj.fix(match) : patternObj.fix,
          description: patternObj.description
        };
      }
    }
  }
  return null;
}

// --- Advanced Error Pattern Matching and Multi-Step Fixes ---
const ADVANCED_ERROR_PATTERNS = [
  {
    name: 'OutOfMemoryError',
    pattern: /JavaScript heap out of memory|FATAL ERROR: Reached heap limit/i,
    fixSteps: [
      () => 'export NODE_OPTIONS=--max-old-space-size=4096',
      () => 'npm run build',
    ],
    description: 'Increase Node.js memory limit and rebuild.'
  },
  {
    name: 'VercelBuildTimeout',
    pattern: /Build exceeded the maximum allowed runtime|Timed out waiting for the build to complete/i,
    fixSteps: [
      () => 'npm run build',
      () => 'touch .vercelignore', // force rebuild
    ],
    description: 'Rebuild and force cache refresh.'
  },
  // Add more advanced patterns as needed
];

function scanLogsForAdvancedErrors(logs) {
  for (const event of logs) {
    if (!event || !event.text) continue;
    for (const patternObj of ADVANCED_ERROR_PATTERNS) {
      const match = event.text.match(patternObj.pattern);
      if (match) {
        return {
          errorType: patternObj.name,
          errorText: event.text,
          fixSteps: patternObj.fixSteps,
          description: patternObj.description
        };
      }
    }
  }
  return null;
}

function runShellCommand(cmd) {
  try {
    console.log(`[AUTO-FIX] Running: ${cmd}`);
    const output = execSync(cmd, { stdio: 'inherit' });
    return output;
  } catch (err) {
    console.error(`[AUTO-FIX] Command failed: ${cmd}`);
    return null;
  }
}

async function fetchVercelEnvVars() {
  let url = `${API_BASE}/v9/projects/${VERCEL_PROJECT}/env`;
  if (VERCEL_TEAM) url += `?teamId=${VERCEL_TEAM}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch Vercel env vars: ${res.statusText}`);
  const data = await res.json();
  return data.envs || [];
}

async function updateVercelEnvVar(key, value, type = 'plain') {
  let url = `${API_BASE}/v9/projects/${VERCEL_PROJECT}/env`;
  if (VERCEL_TEAM) url += `?teamId=${VERCEL_TEAM}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ key, value, target: ['production', 'preview', 'development'], type })
  });
  if (!res.ok) throw new Error(`Failed to update Vercel env var ${key}: ${res.statusText}`);
  return await res.json();
}

async function deleteVercelEnvVar(id) {
  let url = `${API_BASE}/v9/projects/${VERCEL_PROJECT}/env/${id}`;
  if (VERCEL_TEAM) url += `?teamId=${VERCEL_TEAM}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
  });
  if (!res.ok) throw new Error(`Failed to delete Vercel env var ${id}: ${res.statusText}`);
  return await res.json();
}

async function syncVercelEnvVars() {
  const localEnvPath = path.join(__dirname, '../config/qmoi_env_vars.json');
  const localVars = JSON.parse(fs.readFileSync(localEnvPath, 'utf-8'));
  const vercelVars = await fetchVercelEnvVars();
  const vercelVarsMap = Object.fromEntries(vercelVars.map(v => [v.key, v]));
  let changes = [];
  // Add or update vars
  for (const [key, meta] of Object.entries(localVars)) {
    const localValue = meta.default;
    if (!vercelVarsMap[key]) {
      await updateVercelEnvVar(key, localValue);
      changes.push(`Added ${key}`);
    } else if (vercelVarsMap[key].value !== localValue) {
      await updateVercelEnvVar(key, localValue);
      changes.push(`Updated ${key}`);
    }
  }
  // Remove vars not in local config
  for (const v of vercelVars) {
    if (!localVars[v.key]) {
      await deleteVercelEnvVar(v.id);
      changes.push(`Removed ${v.key}`);
    }
  }
  if (changes.length) {
    logSummary('[QMOI] Synced Vercel env vars: ' + changes.join(', '));
  } else {
    logSummary('[QMOI] Vercel env vars already in sync.');
  }
}

async function autoFixAndRedeploy() {
  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    attempt++;
    logSummary(`\n[AUTO-FIX] Attempt ${attempt} of ${MAX_RETRIES}`);
    const deployment = await getLatestDeployment();
    if (!deployment) {
      logSummary('No deployments found.');
      return;
    }
    logSummary(`Latest deployment: ${deployment.url} (state: ${deployment.state})`);
    if (deployment.state === 'READY' && deployment.readyState === 'READY') {
      logSummary('[AUTO-FIX] Deployment is successful!');
      await syncVercelEnvVars();
      return;
    }
    const logs = await getDeploymentLogs(deployment.uid);
    fs.writeFileSync('latest-vercel-logs.json', JSON.stringify(logs, null, 2));
    // --- Advanced error pattern matching ---
    const advanced = scanLogsForAdvancedErrors(logs);
    if (advanced) {
      logSummary(`[AUTO-FIX] Detected advanced error: [${advanced.errorType}]`);
      logSummary(`[AUTO-FIX] Error text: ${advanced.errorText}`);
      for (const step of advanced.fixSteps) {
        const cmd = step();
        if (cmd) runShellCommand(cmd);
      }
      runShellCommand('git add .');
      runShellCommand('git commit -m "auto(vercel): auto-fix for advanced deploy error" || echo "No changes to commit"');
      runShellCommand('git push');
      logSummary(`[AUTO-FIX] Waiting ${WAIT_INTERVAL / 1000} seconds for redeploy to start...`);
      await new Promise(res => setTimeout(res, WAIT_INTERVAL));
      continue;
    }
    // --- Standard error pattern matching ---
    const detected = scanLogsForErrors(logs);
    if (detected) {
      logSummary(`[AUTO-FIX] Detected error: [${detected.errorType}]`);
      logSummary(`[AUTO-FIX] Error text: ${detected.errorText}`);
      logSummary(`[AUTO-FIX] Suggested fix: ${detected.fix}`);
      if (detected.fix.startsWith('npm ') || detected.fix.startsWith('yarn ') || detected.fix.startsWith('pnpm ')) {
        runShellCommand(detected.fix);
      } else if (detected.fix.startsWith('Add missing script:')) {
        logSummary(`[AUTO-FIX] Manual intervention needed: ${detected.fix}`);
        return;
      } else {
        logSummary(`[AUTO-FIX] Unhandled fix type: ${detected.fix}`);
        return;
      }
      runShellCommand('git add .');
      runShellCommand('git commit -m "auto(vercel): auto-fix for detected deploy error" || echo "No changes to commit"');
      runShellCommand('git push');
      logSummary(`[AUTO-FIX] Waiting ${WAIT_INTERVAL / 1000} seconds for redeploy to start...`);
      await new Promise(res => setTimeout(res, WAIT_INTERVAL));
    } else {
      logSummary('[AUTO-FIX] No known errors detected in logs.');
      if (deployment.state !== 'READY') {
        logSummary('[AUTO-FIX] Triggering redeploy...');
        runShellCommand('npx vercel --prod --yes');
        await new Promise(res => setTimeout(res, WAIT_INTERVAL));
      } else {
        logSummary('[AUTO-FIX] Deployment is successful!');
        await syncVercelEnvVars();
        return;
      }
    }
  }
  logSummary('[AUTO-FIX] Max retries reached. Please check manually.');
}

// --- GitLab CI/CD Variable Automation ---
async function ensureGitLabCIVariables() {
  const GITLAB_TOKEN = process.env.GITLAB_TOKEN;
  const GITLAB_PROJECT_ID = process.env.CI_PROJECT_ID;
  if (!GITLAB_TOKEN || !GITLAB_PROJECT_ID) {
    logSummary('[QMOI] Skipping GitLab CI/CD variable automation: GITLAB_TOKEN or CI_PROJECT_ID not set.');
    return;
  }
  const requiredVars = [
    { key: 'VERCEL_TOKEN', value: process.env.VERCEL_TOKEN },
    { key: 'VERCEL_PROJECT', value: process.env.VERCEL_PROJECT },
    { key: 'VERCEL_ORG_ID', value: process.env.VERCEL_ORG_ID }
  ];
  for (const v of requiredVars) {
    if (!v.value) {
      logSummary(`[QMOI] Skipping creation of ${v.key}: value not set in environment.`);
      continue;
    }
    // Check if variable exists
    const url = `https://gitlab.com/api/v4/projects/${GITLAB_PROJECT_ID}/variables/${v.key}`;
    const res = await fetch(url, { headers: { 'PRIVATE-TOKEN': GITLAB_TOKEN } });
    if (res.status === 200) {
      logSummary(`[QMOI] GitLab CI/CD variable ${v.key} already exists.`);
      continue;
    }
    // Create variable
    const createUrl = `https://gitlab.com/api/v4/projects/${GITLAB_PROJECT_ID}/variables`;
    const createRes = await fetch(createUrl, {
      method: 'POST',
      headers: { 'PRIVATE-TOKEN': GITLAB_TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: v.key, value: v.value, protected: true, masked: true })
    });
    if (createRes.status === 201) {
      logSummary(`[QMOI] Created GitLab CI/CD variable: ${v.key}`);
    } else {
      logSummary(`[QMOI] Failed to create GitLab CI/CD variable: ${v.key} (${createRes.status})`);
    }
  }
}

// --- GitLab Resource Creation Test ---
async function testGitLabResourceCreation() {
  const GITLAB_TOKEN = process.env.GITLAB_TOKEN;
  const GITLAB_PROJECT_ID = process.env.CI_PROJECT_ID;
  if (!GITLAB_TOKEN || !GITLAB_PROJECT_ID) {
    logSummary('[QMOI] Skipping GitLab resource creation test: GITLAB_TOKEN or CI_PROJECT_ID not set.');
    return;
  }
  // Try to create a test issue
  const url = `https://gitlab.com/api/v4/projects/${GITLAB_PROJECT_ID}/issues`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'PRIVATE-TOKEN': GITLAB_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'QMOI Test Issue', description: 'This is a test issue created by QMOI automation.' })
  });
  if (res.status === 201) {
    logSummary('[QMOI] Successfully created a test issue in GitLab.');
  } else {
    logSummary(`[QMOI] Failed to create test issue in GitLab (status ${res.status}).`);
  }
}

// --- Simulate Permission Issue ---
async function simulateGitLabPermissionIssue() {
  const GITLAB_TOKEN = process.env.GITLAB_TOKEN;
  const GITLAB_PROJECT_ID = process.env.CI_PROJECT_ID;
  if (!GITLAB_TOKEN || !GITLAB_PROJECT_ID) {
    logSummary('[QMOI] Skipping permission simulation: GITLAB_TOKEN or CI_PROJECT_ID not set.');
    return;
  }
  // Try to create a protected variable (may fail if not admin)
  const url = `https://gitlab.com/api/v4/projects/${GITLAB_PROJECT_ID}/variables`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'PRIVATE-TOKEN': GITLAB_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'QMOI_PROTECTED_TEST', value: 'test', protected: true })
  });
  if (res.status === 201) {
    logSummary('[QMOI] Successfully created a protected variable (permission sufficient).');
  } else if (res.status === 403) {
    logSummary('[QMOI] Permission error: could not create protected variable (expected if not admin).');
  } else {
    logSummary(`[QMOI] Unexpected result when creating protected variable (status ${res.status}).`);
  }
}

// --- Slack Notification Integration ---
async function sendSlackNotification(message) {
  const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
  if (!SLACK_WEBHOOK_URL) {
    logSummary('[QMOI] Slack webhook URL not set. Skipping Slack notification.');
    return;
  }
  const res = await fetch(SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message })
  });
  if (res.status === 200) {
    logSummary('[QMOI] Slack notification sent.');
  } else {
    logSummary(`[QMOI] Failed to send Slack notification (status ${res.status}).`);
  }
}

// --- Universal Variable Automation for GitLab and Other Platforms ---
async function ensureAllPlatformVariables() {
  // GitLab
  if (process.env.GITLAB_TOKEN && process.env.CI_PROJECT_ID) {
    await ensureGitLabCIVariables();
  }
  // (Extend here for other platforms, e.g., GitHub Actions, Vercel, etc.)
  // Example: Vercel project env vars are already synced in syncVercelEnvVars()
  // Slack webhook is set via env/CI/CD variable
  logSummary('[QMOI] Checked and set all required platform variables.');
}

// Entry point
(async () => {
  try {
    const summaryLogPath = path.join(__dirname, '../vercel-auto-fix-summary.log');
    let summaryLog = [];
    function logSummary(msg) {
      summaryLog.push(`[${new Date().toISOString()}] ${msg}`);
      console.log(msg);
      fs.appendFileSync(summaryLogPath, `[${new Date().toISOString()}] ${msg}\n`);
    }
    // Load environment variables from .env securely
    try {
      require('dotenv').config();
      if (!process.env.GITHUB_PERSONAL_ACCESS_TOKEN || !process.env.GITLAB_TOKEN) {
        console.warn('[QMOI] Warning: .env file missing or tokens not set. Make sure to set GITHUB_PERSONAL_ACCESS_TOKEN and GITLAB_TOKEN in .env for local runs.');
      }
    } catch (e) {
      console.warn('[QMOI] dotenv not found or failed to load.');
    }
    await ensureAllPlatformVariables();
    await testGitLabResourceCreation();
    await simulateGitLabPermissionIssue();
    await autoFixAndRedeploy();
    fs.writeFileSync(summaryLogPath, summaryLog.join('\n'));
    // If max retries reached or persistent failure, send Slack notification
    if (summaryLog.some(line => line.includes('Max retries reached') || line.includes('Permission error'))) {
      await sendSlackNotification('QMOI: Persistent failure or permission issue detected in GitLab pipeline. Please review logs.');
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})(); 