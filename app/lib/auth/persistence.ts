const PERSIST_KEYS = {
  ROLE: "qmoi_user_role",
  ID: "qmoi_user_id",
  NAME: "qmoi_user_name",
  ACCESS_TOKEN: "qmoi_access_token",
  REFRESH_TOKEN: "qmoi_refresh_token",
  SESSION_ID: "qmoi_session_id",
};

function getAvailableStorage(): Storage[] {
  if (typeof window === "undefined") return [];
  const storages: Storage[] = [];
  try {
    const storage = window.localStorage;
    storage.setItem("__qmoi_probe__", "1");
    storage.removeItem("__qmoi_probe__");
    storages.push(storage);
  } catch {
    // ignore localStorage failure
  }
  try {
    const storage = window.sessionStorage;
    storage.setItem("__qmoi_probe__", "1");
    storage.removeItem("__qmoi_probe__");
    storages.push(storage);
  } catch {
    // ignore sessionStorage failure
  }
  return storages;
}

function dispatchAuthChangeEvent() {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new Event("qmoi:auth:changed"));
  } catch {
    // Best effort only
  }
}

export function persistUserToStorage(user: { id?: string; role?: string; displayName?: string }) {
  const storages = getAvailableStorage();
  if (storages.length === 0) return;
  try {
    storages.forEach((storage) => {
      if (user.role) storage.setItem(PERSIST_KEYS.ROLE, user.role);
      if (user.id) storage.setItem(PERSIST_KEYS.ID, user.id);
      if (user.displayName) storage.setItem(PERSIST_KEYS.NAME, user.displayName);
    });
    dispatchAuthChangeEvent();
  } catch {
    // ignore storage errors in restricted environments
  }
}

export function persistAuthTokens(tokens: { accessToken?: string | null; refreshToken?: string | null }) {
  const storages = getAvailableStorage();
  if (storages.length === 0) return;
  try {
    storages.forEach((storage) => {
      if (tokens.accessToken) storage.setItem(PERSIST_KEYS.ACCESS_TOKEN, tokens.accessToken);
      if (tokens.refreshToken) storage.setItem(PERSIST_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    });
    dispatchAuthChangeEvent();
  } catch {
    // ignore storage errors in restricted environments
  }
}

export function clearUserFromStorage() {
  if (typeof window === "undefined") return;
  const storageTypes = [window.localStorage, window.sessionStorage];
  try {
    storageTypes.forEach((storage) => {
      try {
        storage.removeItem(PERSIST_KEYS.ROLE);
        storage.removeItem(PERSIST_KEYS.ID);
        storage.removeItem(PERSIST_KEYS.NAME);
      } catch {
        // ignore individual storage failures
      }
    });
  } catch {
    // ignore
  } finally {
    dispatchAuthChangeEvent();
  }
}

export function clearAuthTokens() {
  if (typeof window === "undefined") return;
  const storageTypes = [window.localStorage, window.sessionStorage];
  try {
    storageTypes.forEach((storage) => {
      try {
        storage.removeItem(PERSIST_KEYS.ACCESS_TOKEN);
        storage.removeItem(PERSIST_KEYS.REFRESH_TOKEN);
      } catch {
        // ignore individual storage failures
      }
    });
  } catch {
    // ignore
  } finally {
    dispatchAuthChangeEvent();
  }
}

function readFromStorage(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function readPersistedUser(): { id?: string | null; role?: string | null; displayName?: string | null } | null {
  if (typeof window === "undefined") return null;
  try {
    const role = readFromStorage(window.localStorage, PERSIST_KEYS.ROLE) ?? readFromStorage(window.sessionStorage, PERSIST_KEYS.ROLE);
    const id = readFromStorage(window.localStorage, PERSIST_KEYS.ID) ?? readFromStorage(window.sessionStorage, PERSIST_KEYS.ID);
    const displayName = readFromStorage(window.localStorage, PERSIST_KEYS.NAME) ?? readFromStorage(window.sessionStorage, PERSIST_KEYS.NAME);
    return { id: id || null, role: role || null, displayName: displayName || null };
  } catch {
    return null;
  }
}

export function readPersistedAuthToken(): string | null {
  return readPersistedStorageValue(PERSIST_KEYS.ACCESS_TOKEN);
}

export function readPersistedRefreshToken(): string | null {
  return readPersistedStorageValue(PERSIST_KEYS.REFRESH_TOKEN);
}

export function readPersistedStorageValue(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const value = readFromStorage(window.localStorage, key) ?? readFromStorage(window.sessionStorage, key);
    return value || null;
  } catch {
    return null;
  }
}

export function writePersistedStorageValue(key: string, value: string | null) {
  if (typeof window === "undefined") return;
  try {
    const storages = getAvailableStorage();
    if (storages.length === 0) return;
    storages.forEach((storage) => {
      try {
        if (value === null) storage.removeItem(key);
        else storage.setItem(key, value);
      } catch {
        // ignore individual storage failures
      }
    });
  } catch {
    // ignore
  }
}

export { PERSIST_KEYS };
