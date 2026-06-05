import {
  readPersistedStorageValue,
  writePersistedStorageValue,
} from "@/app/lib/auth/persistence";

const MASTER_TOKEN_KEYS = ["master_token", "QM_MASTER_TOKEN", "masterToken"];

export function readMasterToken(): string | null {
  if (typeof window !== "undefined") {
    for (const key of MASTER_TOKEN_KEYS) {
      const stored = readPersistedStorageValue(key);
      if (stored) {
        return stored;
      }
    }
  }

  return process.env.NEXT_PUBLIC_MASTER_TOKEN || null;
}

export function writeMasterToken(token: string | null) {
  if (typeof window === "undefined") return;
  for (const key of MASTER_TOKEN_KEYS) {
    writePersistedStorageValue(key, token);
  }
}

export function buildMasterHeaders(token?: string): Record<string, string> {
  const masterToken = token || readMasterToken();
  return masterToken ? { Authorization: `Bearer ${masterToken}` } : {};
}
