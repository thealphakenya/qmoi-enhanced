// scripts/qmoi-gitlab-sync.js
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const configPath = path.resolve(__dirname, '../config/qmoi_env_vars.json');
const envVars = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const GITLAB_TOKEN = process.env.GITLAB_TOKEN;
const GITLAB_PROJECT_ID = process.env.GITLAB_PROJECT_ID;
const GITLAB_API_URL = process.env.GITLAB_API_URL || 'https://gitlab.com/api/v4';

if (!GITLAB_TOKEN || !GITLAB_PROJECT_ID) {
  console.error('QMOI GITLAB SYNC ERROR: GITLAB_TOKEN and GITLAB_PROJECT_ID must be set in env.');
  process.exit(1);
}

async function upsertVariable(key, value) {
  try {
    // Try to update first
    await axios.put(
      `${GITLAB_API_URL}/projects/${encodeURIComponent(GITLAB_PROJECT_ID)}/variables/${key}`,
      { value, protected: false, masked: false },
      { headers: { 'PRIVATE-TOKEN': GITLAB_TOKEN } }
    );
    console.log(`QMOI: Updated GitLab variable ${key}`);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      // Create if not found
      await axios.post(
        `${GITLAB_API_URL}/projects/${encodeURIComponent(GITLAB_PROJECT_ID)}/variables`,
        { key, value, protected: false, masked: false },
        { headers: { 'PRIVATE-TOKEN': GITLAB_TOKEN } }
      );
      console.log(`QMOI: Created GitLab variable ${key}`);
    } else {
      console.error(`QMOI: Failed to upsert variable ${key}:`, err.message);
    }
  }
}

(async () => {
  for (const [key, { default: def }] of Object.entries(envVars)) {
    const value = process.env[key] || def;
    await upsertVariable(key, value);
  }
  console.log('QMOI: GitLab CI/CD variable sync complete.');
})(); 