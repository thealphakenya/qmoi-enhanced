// QMOI Automated Environment Setup Script (ESM)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envTemplate = `NODE_ENV=production\nPORT=3000\nDATABASE_URL=your_database_url_here\nAPI_KEY=your_api_key_here\nVERCEL_TOKEN=your_vercel_token_here\nQMOI_SECRET=your_qmoi_secret_here\n`;

function ensureEnvFiles() {
  const envPath = path.join(__dirname, '../.env');
  const envExamplePath = path.join(__dirname, '../.env.example');
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envTemplate);
    console.log('.env file created.');
  }
  if (!fs.existsSync(envExamplePath)) {
    fs.writeFileSync(envExamplePath, envTemplate);
    console.log('.env.example file created.');
  }
}

function updateEnvVariable(key, value) {
  const envPath = path.join(__dirname, '../.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (envContent.match(regex)) {
    envContent = envContent.replace(regex, `${key}=${value}`);
  } else {
    envContent += `\n${key}=${value}`;
  }
  fs.writeFileSync(envPath, envContent);
  console.log(`Updated ${key} in .env.`);
}

// Main automation entry point
function autoSetupEnv() {
  ensureEnvFiles();
  // Ensure config directory and default JSON configs exist
  try { fs.mkdirSync(path.join(__dirname, '../config'), { recursive: true }); } catch (e) {}
  const defaults = {
    'placeholder-config.json': JSON.stringify({ denyList: ['TODO', 'FIXME'], approvedList: ['AVATAR','PLACE','FACE'] }, null, 2),
    'placeholder_approvals.json': JSON.stringify({ requireApprovalFor: ['RELEASE_*'], approved: [] }, null, 2),
    'face-mappings.json': JSON.stringify({ faces: [{ id: 'smile', name: 'Smiling Face', style: 'friendly' }] }, null, 2),
    'place-mappings.json': JSON.stringify({ places: ['Nairobi','Kisumu','Mombasa'] }, null, 2),
    'avatar-config.json': JSON.stringify({ defaultAvatar: 'qmoi-default', masterAvatars: ['qmoi-master'] }, null, 2)
  };
  Object.entries(defaults).forEach(([name, data]) => {
    const p = path.join(__dirname, '..', 'config', name);
    if (!fs.existsSync(p)) fs.writeFileSync(p, data);
  });
  // Platform-specific credential automation
  const platforms = [
    { name: 'Vercel', vars: ['VERCEL_TOKEN', 'VERCEL_PROJECT_ID'] },
    { name: 'AWS', vars: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION'] },
    { name: 'GCP', vars: ['GCP_PROJECT_ID', 'GCP_CLIENT_EMAIL', 'GCP_PRIVATE_KEY'] },
    { name: 'Azure', vars: ['AZURE_CLIENT_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_SECRET'] },
    { name: 'GitHub', vars: ['GITHUB_TOKEN', 'GITHUB_REPO'] }
  ];
  platforms.forEach(platform => {
    platform.vars.forEach(variable => {
      updateEnvVariable(variable, `your_${variable.toLowerCase()}_here`);
    });
  });
  console.log('Platform credentials and variables have been auto-populated in .env.');
}

autoSetupEnv();
