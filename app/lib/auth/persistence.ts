const PERSIST_KEYS = {
  ROLE: "qmoi_user_role",
  ID: "qmoi_user_id",
  NAME: "qmoi_user_name",
};

export function persistUserToStorage(user: { id?: string; role?: string; displayName?: string }) {
  if (typeof window === "undefined") return;
  try {
    if (user.role) window.localStorage.setItem(PERSIST_KEYS.ROLE, user.role);
    if (user.id) window.localStorage.setItem(PERSIST_KEYS.ID, user.id);
    if (user.displayName) window.localStorage.setItem(PERSIST_KEYS.NAME, user.displayName);
  } catch (e) {
    // ignore storage errors in restricted environments
  }
}

export function clearUserFromStorage() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PERSIST_KEYS.ROLE);
    window.localStorage.removeItem(PERSIST_KEYS.ID);
    window.localStorage.removeItem(PERSIST_KEYS.NAME);
  } catch (e) {
    // ignore
  }
}

export function readPersistedUser(): { id?: string | null; role?: string | null; displayName?: string | null } | null {
  if (typeof window === "undefined") return null;
  try {
    const role = window.localStorage.getItem(PERSIST_KEYS.ROLE);
    const id = window.localStorage.getItem(PERSIST_KEYS.ID);
    const displayName = window.localStorage.getItem(PERSIST_KEYS.NAME);
    return { id: id || null, role: role || null, displayName: displayName || null };
  } catch (e) {
    return null;
  }
}

export { PERSIST_KEYS };
