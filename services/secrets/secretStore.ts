import fs from 'fs';
import path from 'path';

const SECRETS_FILE = path.join(__dirname, '..', '..', 'data', 'secrets.json');

function ensureSecretStore() {
  const dir = path.dirname(SECRETS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(SECRETS_FILE)) {
    fs.writeFileSync(SECRETS_FILE, '{}', 'utf-8');
  }
}

export interface SecretStore {
  getSecret(key: string): Promise<string | undefined>;
  setSecret(key: string, value: string): Promise<void>;
}

export class LocalSecretStore implements SecretStore {
  async getSecret(key: string) {
    try {
      ensureSecretStore();
      const raw = fs.readFileSync(SECRETS_FILE, 'utf-8');
      const data = JSON.parse(raw || '{}');
      return data[key];
    } catch (error) {
      console.error('LocalSecretStore.getSecret failed', error);
      return undefined;
    }
  }

  async setSecret(key: string, value: string) {
    try {
      ensureSecretStore();
      const raw = fs.readFileSync(SECRETS_FILE, 'utf-8');
      const data = JSON.parse(raw || '{}');
      data[key] = value;
      fs.writeFileSync(SECRETS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('LocalSecretStore.setSecret failed', error);
    }
  }
}

export function selectSecretStore(): SecretStore {
  const backend = process.env.SECRET_BACKEND || 'local';
  if (backend === 'local') {
    return new LocalSecretStore();
  }
  return new LocalSecretStore();
}
