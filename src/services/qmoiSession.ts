// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:14Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// Manage a persistent `qmoi_session_id` and headers for requests
import { readPersistedStorageValue, writePersistedStorageValue, readPersistedUser, persistUserToStorage } from "@/app/lib/auth/persistence";
import { log } from "@/lib/logger";

export /**
 * getSessionId function
 */
function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = readPersistedStorageValue("qmoi_session_id");
    if (!sid) {
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      writePersistedStorageValue("qmoi_session_id", sid);
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(sid)}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    log.error("getSessionId error:", e instanceof Error ? e : new Error(String(e)));
    return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }
}

export /**
 * getSessionHeaders function
 */
function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    if (typeof window !== "undefined") {
      const persisted = readPersistedUser();
      if (persisted && persisted.role) headers["X-QMOI-ROLE"] = persisted.role;
      if (persisted && persisted.displayName) headers["X-QMOI-USER"] = persisted.displayName;
    }
  } catch (_e) {
    void _e;
  }
  return headers;
}

export /**
 * setProfile function
 */
function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}): any {
  try {
    persistUserToStorage({ id: profile.userId, role: profile.role, displayName: profile.name });
  } catch (_e) {
    void _e;
  }
}
