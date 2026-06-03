const PERSIST_KEYS = {
  ROLE: "qmoi_user_role",
  ID: "qmoi_user_id",
  NAME: "qmoi_user_name",
};

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    const storage = window.localStorage;
    storage.setItem("__qmoi_probe__", "1");
    storage.removeItem("__qmoi_probe__");
    return storage;
  } catch {
    try {
      const storage = window.sessionStorage;
      storage.setItem("__qmoi_probe__", "1");
      storage.removeItem("__qmoi_probe__");
      return storage;
    } catch {
      return null;
    }
  }
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
  const storage = getStorage();
  if (!storage) return;
  try {
    if (user.role) storage.setItem(PERSIST_KEYS.ROLE, user.role);
    if (user.id) storage.setItem(PERSIST_KEYS.ID, user.id);
    if (user.displayName) storage.setItem(PERSIST_KEYS.NAME, user.displayName);
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

export { PERSIST_KEYS };
