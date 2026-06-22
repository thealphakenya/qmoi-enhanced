import fs from 'fs';
import path from 'path';
import adapterRegistry from './adapters/index';

const ACCOUNTS_FILE = path.join(__dirname, '..', 'data', 'platform_accounts.json');

export type AccountRecord = {
  id: string;
  platform: string;
  username?: string;
  accountId?: string;
  createdAt: string;
  createdBy: 'qmoi' | 'master' | 'import';
  metadata?: Record<string, any>;
  status?: 'unverified' | 'verified' | 'enabled';
};

function ensureFile() {
  const dir = path.dirname(ACCOUNTS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(ACCOUNTS_FILE)) {
    fs.writeFileSync(ACCOUNTS_FILE, '[]', 'utf-8');
  }
}

export function listAccounts(): AccountRecord[] {
  ensureFile();
  try {
    const raw = fs.readFileSync(ACCOUNTS_FILE, 'utf-8');
    return JSON.parse(raw) as AccountRecord[];
  } catch (error) {
    console.error('Failed to read accounts file:', error);
    return [];
  }
}

export function addAccount(record: Omit<AccountRecord, 'id' | 'createdAt'>): AccountRecord {
  ensureFile();
  const accounts = listAccounts();
  const newRec: AccountRecord = {
    id: Math.random().toString(36).slice(2),
    createdAt: new Date().toISOString(),
    ...record,
  };
  accounts.push(newRec);
  fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2), 'utf-8');
  return newRec;
}

export function findByPlatform(platform: string): AccountRecord[] {
  return listAccounts().filter((account) => account.platform.toLowerCase() === platform.toLowerCase());
}

export function importFromEnv(): number {
  ensureFile();
  const accounts = listAccounts();
  const env = process.env;
  const known = [
    'FACEBOOK_TOKEN',
    'FB_TOKEN',
    'TWITTER_TOKEN',
    'TWITTER_API_KEY',
    'INSTAGRAM_TOKEN',
    'LINKEDIN_TOKEN',
    'YOUTUBE_API_KEY',
    'AMAZON_SELLER_TOKEN',
    'PAYPAL_API_KEY',
    'STRIPE_KEY',
  ];

  known.forEach((key) => {
    if (env[key]) {
      accounts.push({
        id: Math.random().toString(36).slice(2),
        platform: key.split('_')[0].toLowerCase(),
        username: env[`${key}_USERNAME`] || undefined,
        accountId: undefined,
        createdAt: new Date().toISOString(),
        createdBy: 'import',
        metadata: { sourceEnv: key },
        status: 'unverified',
      });
    }
  });

  fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2), 'utf-8');
  return accounts.length;
}

export function prepareAccountCreation(platform: string, desiredUsername?: string, meta?: Record<string, any>) {
  return {
    platform,
    desiredUsername,
    checks: [
      'Check platform terms of service for automated account creation',
      'Confirm CAPTCHA and phone verification requirements',
      'Validate email or phone ownership',
      'Schedule human review before account creation',
    ],
    estimatedEffort: 'manual approval required',
    metadata: meta,
  };
}

export default {
  listAccounts,
  addAccount,
  findByPlatform,
  importFromEnv,
  prepareAccountCreation,
  registerAdapter: adapterRegistry.registerAdapter,
  getAdapter: adapterRegistry.getAdapter,
  listRegisteredAdapters: adapterRegistry.listAdapters,
};
