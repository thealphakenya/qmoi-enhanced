// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/qmoiSession.ts -->
// Manage a persistent `qmoi_session_id` and headers for requests
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = localStorage.getItem("qmoi_session_id");
    if (!sid) {
      // try cookie
      const m = document.cookie.match(/(?:^|; )qmoi_session_id=([^;]+)/);
      if (m) sid = decodeURIComponent(m[1]);
    }
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("qmoi_session_id", sid);
      // set cookie for client too
      try {
        document.cookie = `qmoi_session_id=${encodeURIComponent(
          sid,
        )}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      } catch (_e) {
        void _e;
      }
    }
    return sid;
  } catch (e) {
    void e;
  }
}

export function getSessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const sid = getSessionId();
    if (sid) headers["X-QMOI-SESSION"] = sid;
    const role =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_role")
        : undefined;
    if (role) headers["X-QMOI-ROLE"] = role;
    const user =
      typeof window !== "undefined"
        ? localStorage.getItem("qmoi_user")
        : undefined;
    if (user) headers["X-QMOI-USER"] = user;
  } catch (_e) {
    void _e;
  }
  return headers;
}

export function setProfile(profile: {
  name?: string;
  role?: string;
  userId?: string;
}) {
  try {
    if (profile.role) localStorage.setItem("qmoi_role", profile.role);
    if (profile.name) localStorage.setItem("qmoi_user", profile.name);
    if (profile.userId) localStorage.setItem("qmoi_userid", profile.userId);
  } catch (_e) {
    void _e;
  }
}
