/**
 * SecretStore abstraction.
 * - LocalSecretStore: file-backed secrets for development only (data/secrets.json)
 * - In production, set SECRET_BACKEND=kms and implement KMSSecretStore that proxies to a real KMS/HSM.
 * NOTE: This file intentionally does not implement network calls. It provides an abstraction to
 * make it easy to swap into a secure secrets manager in production.
 */
import fs from "fs";
import path from "path";

const SECRETS_FILE = path.join(__dirname, "..", "..", "data", "secrets.json");
if (!fs.existsSync(path.dirname(SECRETS_FILE)))
  fs.mkdirSync(path.dirname(SECRETS_FILE), { recursive: true });
if (!fs.existsSync(SECRETS_FILE)) fs.writeFileSync(SECRETS_FILE, "{}", "utf-8");

export interface SecretStore {
  getSecret(key: string): Promise<string | undefined>;
  setSecret(key: string, value: string): Promise<void>;
}

export class LocalSecretStore implements SecretStore {
  async getSecret(key: string) {
    try {
      const raw = fs.readFileSync(SECRETS_FILE, "utf-8");
      const obj = JSON.parse(raw || "{}");
      return obj[key];
    } catch (e) {
      globalThis.console.error(
        "LocalSecretStore.getSecret failed",
        _e,
      );
      return undefined;
    }
  }
  async setSecret(key: string, value: string) {
    try {
      const raw = fs.readFileSync(SECRETS_FILE, "utf-8");
      const obj = JSON.parse(raw || "{}");
      obj[key] = value;
      fs.writeFileSync(SECRETS_FILE, JSON.stringify(obj, null, 2), "utf-8");
    } catch (e) {
      globalThis.console.error(
        "LocalSecretStore.setSecret failed",
        _e,
      );
    }
  }
}

// Factory
export function selectSecretStore(): SecretStore {
  const backend = process.env.SECRET_BACKEND || "local";
  if (backend === "local") return new LocalSecretStore();
  // In production code replace with real KMS/HSM backed implementation.
  console.warn(
    "SecretStore: using local fallback store; replace with KMS in production",
  );
  return new LocalSecretStore();
}

export default { LocalSecretStore, selectSecretStore };
