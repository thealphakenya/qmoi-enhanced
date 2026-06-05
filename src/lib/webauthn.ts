import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { log } from '@/lib/logger';

export type WebAuthnFlow = 'register' | 'authenticate';

export interface WebAuthnChallenge {
  email: string;
  type: WebAuthnFlow;
  challenge: string;
  createdAt: string;
  expiresAt: string;
}

export interface WebAuthnCredentialRecord {
  id: string;
  userId: string;
  email: string;
  credentialId: string;
  publicKey: string;
  transports: string[];
  type: 'webauthn';
  counter: number;
  enrolledAt: string;
  lastUsed: string;
}

const CREDENTIALS_FILE = path.resolve(process.cwd(), 'data', 'webauthn-credentials.json');
const CHALLENGE_TTL_MS = 5 * 60 * 1000; // 5 minutes

declare global {
  var __webauthnChallengeStore?: Record<string, WebAuthnChallenge>;
}

function getChallengeStore(): Record<string, WebAuthnChallenge> {
  if (!globalThis.__webauthnChallengeStore) {
    globalThis.__webauthnChallengeStore = {};
  }
  return globalThis.__webauthnChallengeStore;
}

function getChallengeKey(email: string, type: WebAuthnFlow): string {
  return `${type}:${email.toLowerCase()}`;
}

export function createWebAuthnChallenge(email: string, type: WebAuthnFlow): WebAuthnChallenge {
  const challenge = crypto.randomBytes(32).toString('base64url');
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + CHALLENGE_TTL_MS).toISOString();
  const record: WebAuthnChallenge = { email, type, challenge, createdAt, expiresAt };
  const store = getChallengeStore();
  const key = getChallengeKey(email, type);
  store[key] = record;

  setTimeout(() => {
    delete store[key];
  }, CHALLENGE_TTL_MS);

  return record;
}

export function consumeWebAuthnChallenge(email: string, type: WebAuthnFlow, challenge: string): boolean {
  const store = getChallengeStore();
  const key = getChallengeKey(email, type);
  const record = store[key];

  if (!record || record.challenge !== challenge) {
    return false;
  }

  const expired = Date.now() > new Date(record.expiresAt).getTime();
  if (expired) {
    delete store[key];
    return false;
  }

  delete store[key];
  return true;
}

async function ensureCredentialsFile(): Promise<void> {
  try {
    await fs.mkdir(path.dirname(CREDENTIALS_FILE), { recursive: true });
    await fs.access(CREDENTIALS_FILE).catch(async () => {
      await fs.writeFile(CREDENTIALS_FILE, '[]', { encoding: 'utf8' });
    });
  } catch (error) {
    log.error('Failed to ensure WebAuthn credential store', error);
    throw error;
  }
}

export async function loadWebAuthnCredentials(): Promise<WebAuthnCredentialRecord[]> {
  await ensureCredentialsFile();
  const raw = await fs.readFile(CREDENTIALS_FILE, 'utf8');
  try {
    return JSON.parse(raw) as WebAuthnCredentialRecord[];
  } catch (error) {
    log.error('Failed to parse WebAuthn credential store', error);
    return [];
  }
}

export async function saveWebAuthnCredentials(credentials: WebAuthnCredentialRecord[]): Promise<void> {
  await ensureCredentialsFile();
  await fs.writeFile(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2), { encoding: 'utf8' });
}

export async function getCredentialByEmail(email: string): Promise<WebAuthnCredentialRecord | undefined> {
  const credentials = await loadWebAuthnCredentials();
  return credentials.find((item) => item.email.toLowerCase() === email.toLowerCase());
}

export async function getCredentialById(credentialId: string): Promise<WebAuthnCredentialRecord | undefined> {
  const credentials = await loadWebAuthnCredentials();
  return credentials.find((item) => item.credentialId === credentialId);
}

export async function registerWebAuthnCredential(params: {
  email: string;
  credentialId: string;
  publicKey: string;
  transports?: string[];
  counter?: number;
}): Promise<WebAuthnCredentialRecord> {
  const credentials = await loadWebAuthnCredentials();
  const userId = crypto.createHash('sha256').update(params.email.toLowerCase()).digest('hex');
  const now = new Date().toISOString();
  const existingIndex = credentials.findIndex(
    (item) => item.email.toLowerCase() === params.email.toLowerCase() && item.credentialId === params.credentialId,
  );
  const newRecord: WebAuthnCredentialRecord = {
    id: crypto.randomUUID(),
    userId,
    email: params.email.toLowerCase(),
    credentialId: params.credentialId,
    publicKey: params.publicKey,
    transports: params.transports?.length ? params.transports : ['platform'],
    type: 'webauthn',
    counter: params.counter ?? 0,
    enrolledAt: now,
    lastUsed: now,
  };

  if (existingIndex >= 0) {
    credentials[existingIndex] = {
      ...credentials[existingIndex],
      publicKey: params.publicKey,
      transports: newRecord.transports,
      counter: newRecord.counter,
      lastUsed: now,
    };
  } else {
    credentials.push(newRecord);
  }

  await saveWebAuthnCredentials(credentials);
  return newRecord;
}

export async function updateWebAuthnCredentialLastUsed(credentialId: string): Promise<void> {
  const credentials = await loadWebAuthnCredentials();
  const index = credentials.findIndex((item) => item.credentialId === credentialId);
  if (index === -1) {
    return;
  }
  credentials[index].lastUsed = new Date().toISOString();
  await saveWebAuthnCredentials(credentials);
}

export function makeWebAuthnOptions(email: string, type: WebAuthnFlow) {
  const challenge = createWebAuthnChallenge(email, type);
  const rpId = process.env.RP_ID || process.env.ORIGIN?.replace(/^https?:\/\//, '')?.split('/')[0] || 'qmoi.ai';
  const userId = crypto.createHash('sha256').update(email.toLowerCase()).digest().toString('base64url');

  const options: Record<string, unknown> = {
    challenge: challenge.challenge,
    timeout: 60000,
    userVerification: 'preferred',
    rpId,
  };

  if (type === 'register') {
    options.rp = { name: 'QMOI Enhanced', id: rpId };
    options.user = {
      id: userId,
      name: email,
      displayName: email.split('@')[0] || email,
    };
    options.pubKeyCredParams = [
      { alg: -7, type: 'public-key' },
      { alg: -257, type: 'public-key' },
    ];
    options.attestation = 'direct';
    options.authenticatorSelection = {
      authenticatorAttachment: 'platform',
      residentKey: 'preferred',
      userVerification: 'required',
    };
  }

  return options;
}

export function verifyWebAuthnAssertion(
  assertion: { signature?: string; clientDataJSON?: string; rawId?: string; authenticatorData?: string },
  credential: WebAuthnCredentialRecord | undefined,
  challenge: string,
) {
  if (!credential) {
    return { valid: false, reason: 'No registered credential found' };
  }

  if (!assertion.signature) {
    return { valid: false, reason: 'Signature is missing from assertion' };
  }

  if (!credential.publicKey) {
    return { valid: false, reason: 'No public key stored for credential' };
  }

  try {
    let publicKey: crypto.KeyObject;
    if (credential.publicKey.trim().startsWith('-----BEGIN')) {
      publicKey = crypto.createPublicKey(credential.publicKey);
    } else {
      publicKey = crypto.createPublicKey({ key: Buffer.from(credential.publicKey, 'base64'), format: 'der', type: 'spki' });
    }

    const signatureBuffer = Buffer.from(assertion.signature, 'base64');
    const payload = assertion.clientDataJSON
      ? Buffer.from(assertion.clientDataJSON, 'base64')
      : Buffer.from(challenge, 'utf8');

    const verified = crypto.verify(null, payload, publicKey, signatureBuffer);
    return { valid: verified, reason: verified ? null : 'Assertion signature verification failed' };
  } catch (error) {
    log.warn('WebAuthn assertion verification failed', { error: error instanceof Error ? error.message : error });
    return { valid: false, reason: error instanceof Error ? error.message : 'Assertion verification failed' };
  }
}
