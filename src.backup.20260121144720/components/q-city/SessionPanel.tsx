import React, { useEffect, useState } from "react";

export interface SessionItem {
  sid: string;
  createdAt?: string;
  expiresAt?: string;
}

export default function SessionPanel() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchSessions = () => {
    setLoading(true);
    fetch("/api/auth/session", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const items = (d.sessions ?? []) as unknown[];
        setSessions(items as SessionItem[]);
      })
      .catch((_err: unknown) => {
        console.warn("fetch sessions failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const revoke = (sid: string) => {
    setLoading(true);
    fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ action: "revoke", sid }),
    })
      .then(fetchSessions)
      .catch((_err: unknown) => {
        console.warn("revoke session failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Sessions</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <table className="w-full text-xs text-left text-gray-300">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Created</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s: SessionItem, i) => (
              <tr key={i}>
                <td>{s.sid}</td>
                <td>{s.createdAt}</td>
                <td>{s.expiresAt}</td>
                <td>
                  <button
                    onClick={() => revoke(s.sid)}
                    className="px-2 py-1 bg-red-700 rounded text-white"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/SessionPanel.tsx -->
import React, { useEffect, useState } from "react";

export interface SessionItem {
  sid: string;
  createdAt?: string;
  expiresAt?: string;
}

export default function SessionPanel() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchSessions = () => {
    setLoading(true);
    fetch("/api/auth/session", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const items = (d.sessions ?? []) as unknown[];
        setSessions(items as SessionItem[]);
      })
      .catch((_err: unknown) => {
        console.warn("fetch sessions failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const revoke = (sid: string) => {
    setLoading(true);
    fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ action: "revoke", sid }),
    })
      .then(fetchSessions)
      .catch((_err: unknown) => {
        console.warn("revoke session failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Sessions</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <table className="w-full text-xs text-left text-gray-300">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Created</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s: SessionItem, i) => (
              <tr key={i}>
                <td>{s.sid}</td>
                <td>{s.createdAt}</td>
                <td>{s.expiresAt}</td>
                <td>
                  <button
                    onClick={() => revoke(s.sid)}
                    className="px-2 py-1 bg-red-700 rounded text-white"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/SessionPanel.tsx -->
import React, { useEffect, useState } from "react";

export interface SessionItem {
  sid: string;
  createdAt?: string;
  expiresAt?: string;
}

export default function SessionPanel() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchSessions = () => {
    setLoading(true);
    fetch("/api/auth/session", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const items = (d.sessions ?? []) as unknown[];
        setSessions(items as SessionItem[]);
      })
      .catch((_err: unknown) => {
        console.warn("fetch sessions failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const revoke = (sid: string) => {
    setLoading(true);
    fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ action: "revoke", sid }),
    })
      .then(fetchSessions)
      .catch((_err: unknown) => {
        console.warn("revoke session failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Sessions</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <table className="w-full text-xs text-left text-gray-300">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Created</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s: SessionItem, i) => (
              <tr key={i}>
                <td>{s.sid}</td>
                <td>{s.createdAt}</td>
                <td>{s.expiresAt}</td>
                <td>
                  <button
                    onClick={() => revoke(s.sid)}
                    className="px-2 py-1 bg-red-700 rounded text-white"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/SessionPanel.tsx -->
import React, { useEffect, useState } from "react";

export interface SessionItem {
  sid: string;
  createdAt?: string;
  expiresAt?: string;
}

export default function SessionPanel() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchSessions = () => {
    setLoading(true);
    fetch("/api/auth/session", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const items = (d.sessions ?? []) as unknown[];
        setSessions(items as SessionItem[]);
      })
      .catch((_err: unknown) => {
        console.warn("fetch sessions failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const revoke = (sid: string) => {
    setLoading(true);
    fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ action: "revoke", sid }),
    })
      .then(fetchSessions)
      .catch((_err: unknown) => {
        console.warn("revoke session failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Sessions</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <table className="w-full text-xs text-left text-gray-300">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Created</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s: SessionItem, i) => (
              <tr key={i}>
                <td>{s.sid}</td>
                <td>{s.createdAt}</td>
                <td>{s.expiresAt}</td>
                <td>
                  <button
                    onClick={() => revoke(s.sid)}
                    className="px-2 py-1 bg-red-700 rounded text-white"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/SessionPanel.tsx -->
import React, { useEffect, useState } from "react";

export interface SessionItem {
  sid: string;
  createdAt?: string;
  expiresAt?: string;
}

export default function SessionPanel() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchSessions = () => {
    setLoading(true);
    fetch("/api/auth/session", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const items = (d.sessions ?? []) as unknown[];
        setSessions(items as SessionItem[]);
      })
      .catch((_err: unknown) => {
        console.warn("fetch sessions failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const revoke = (sid: string) => {
    setLoading(true);
    fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ action: "revoke", sid }),
    })
      .then(fetchSessions)
      .catch((_err: unknown) => {
        console.warn("revoke session failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Sessions</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <table className="w-full text-xs text-left text-gray-300">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Created</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s: SessionItem, i) => (
              <tr key={i}>
                <td>{s.sid}</td>
                <td>{s.createdAt}</td>
                <td>{s.expiresAt}</td>
                <td>
                  <button
                    onClick={() => revoke(s.sid)}
                    className="px-2 py-1 bg-red-700 rounded text-white"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/SessionPanel.tsx -->
import React, { useEffect, useState } from "react";

export interface SessionItem {
  sid: string;
  createdAt?: string;
  expiresAt?: string;
}

export default function SessionPanel() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchSessions = () => {
    setLoading(true);
    fetch("/api/auth/session", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const items = (d.sessions ?? []) as unknown[];
        setSessions(items as SessionItem[]);
      })
      .catch((_err: unknown) => {
        console.warn("fetch sessions failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const revoke = (sid: string) => {
    setLoading(true);
    fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ action: "revoke", sid }),
    })
      .then(fetchSessions)
      .catch((_err: unknown) => {
        console.warn("revoke session failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Sessions</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <table className="w-full text-xs text-left text-gray-300">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Created</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s: SessionItem, i) => (
              <tr key={i}>
                <td>{s.sid}</td>
                <td>{s.createdAt}</td>
                <td>{s.expiresAt}</td>
                <td>
                  <button
                    onClick={() => revoke(s.sid)}
                    className="px-2 py-1 bg-red-700 rounded text-white"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/SessionPanel.tsx -->
import React, { useEffect, useState } from "react";

export interface SessionItem {
  sid: string;
  createdAt?: string;
  expiresAt?: string;
}

export default function SessionPanel() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchSessions = () => {
    setLoading(true);
    fetch("/api/auth/session", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const items = (d.sessions ?? []) as unknown[];
        setSessions(items as SessionItem[]);
      })
      .catch((_err: unknown) => {
        console.warn("fetch sessions failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const revoke = (sid: string) => {
    setLoading(true);
    fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ action: "revoke", sid }),
    })
      .then(fetchSessions)
      .catch((_err: unknown) => {
        console.warn("revoke session failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Sessions</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <table className="w-full text-xs text-left text-gray-300">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Created</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s: SessionItem, i) => (
              <tr key={i}>
                <td>{s.sid}</td>
                <td>{s.createdAt}</td>
                <td>{s.expiresAt}</td>
                <td>
                  <button
                    onClick={() => revoke(s.sid)}
                    className="px-2 py-1 bg-red-700 rounded text-white"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/SessionPanel.tsx -->
import React, { useEffect, useState } from "react";

export interface SessionItem {
  sid: string;
  createdAt?: string;
  expiresAt?: string;
}

export default function SessionPanel() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchSessions = () => {
    setLoading(true);
    fetch("/api/auth/session", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const items = (d.sessions ?? []) as unknown[];
        setSessions(items as SessionItem[]);
      })
      .catch((_err: unknown) => {
        console.warn("fetch sessions failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const revoke = (sid: string) => {
    setLoading(true);
    fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ action: "revoke", sid }),
    })
      .then(fetchSessions)
      .catch((_err: unknown) => {
        console.warn("revoke session failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Sessions</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <table className="w-full text-xs text-left text-gray-300">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Created</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s: SessionItem, i) => (
              <tr key={i}>
                <td>{s.sid}</td>
                <td>{s.createdAt}</td>
                <td>{s.expiresAt}</td>
                <td>
                  <button
                    onClick={() => revoke(s.sid)}
                    className="px-2 py-1 bg-red-700 rounded text-white"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/SessionPanel.tsx -->
import React, { useEffect, useState } from "react";

export interface SessionItem {
  sid: string;
  createdAt?: string;
  expiresAt?: string;
}

export default function SessionPanel() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchSessions = () => {
    setLoading(true);
    fetch("/api/auth/session", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const items = (d.sessions ?? []) as unknown[];
        setSessions(items as SessionItem[]);
      })
      .catch((_err: unknown) => {
        console.warn("fetch sessions failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const revoke = (sid: string) => {
    setLoading(true);
    fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ action: "revoke", sid }),
    })
      .then(fetchSessions)
      .catch((_err: unknown) => {
        console.warn("revoke session failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Sessions</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <table className="w-full text-xs text-left text-gray-300">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Created</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s: SessionItem, i) => (
              <tr key={i}>
                <td>{s.sid}</td>
                <td>{s.createdAt}</td>
                <td>{s.expiresAt}</td>
                <td>
                  <button
                    onClick={() => revoke(s.sid)}
                    className="px-2 py-1 bg-red-700 rounded text-white"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/SessionPanel.tsx -->
import React, { useEffect, useState } from "react";

export interface SessionItem {
  sid: string;
  createdAt?: string;
  expiresAt?: string;
}

export default function SessionPanel() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchSessions = () => {
    setLoading(true);
    fetch("/api/auth/session", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const items = (d.sessions ?? []) as unknown[];
        setSessions(items as SessionItem[]);
      })
      .catch((_err: unknown) => {
        console.warn("fetch sessions failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const revoke = (sid: string) => {
    setLoading(true);
    fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ action: "revoke", sid }),
    })
      .then(fetchSessions)
      .catch((_err: unknown) => {
        console.warn("revoke session failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Sessions</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <table className="w-full text-xs text-left text-gray-300">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Created</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s: SessionItem, i) => (
              <tr key={i}>
                <td>{s.sid}</td>
                <td>{s.createdAt}</td>
                <td>{s.expiresAt}</td>
                <td>
                  <button
                    onClick={() => revoke(s.sid)}
                    className="px-2 py-1 bg-red-700 rounded text-white"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/SessionPanel.tsx -->
import React, { useEffect, useState } from "react";

export interface SessionItem {
  sid: string;
  createdAt?: string;
  expiresAt?: string;
}

export default function SessionPanel() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchSessions = () => {
    setLoading(true);
    fetch("/api/auth/session", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const items = (d.sessions ?? []) as unknown[];
        setSessions(items as SessionItem[]);
      })
      .catch((_err: unknown) => {
        console.warn("fetch sessions failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const revoke = (sid: string) => {
    setLoading(true);
    fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ action: "revoke", sid }),
    })
      .then(fetchSessions)
      .catch((_err: unknown) => {
        console.warn("revoke session failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Sessions</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <table className="w-full text-xs text-left text-gray-300">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Created</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s: SessionItem, i) => (
              <tr key={i}>
                <td>{s.sid}</td>
                <td>{s.createdAt}</td>
                <td>{s.expiresAt}</td>
                <td>
                  <button
                    onClick={() => revoke(s.sid)}
                    className="px-2 py-1 bg-red-700 rounded text-white"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/SessionPanel.tsx -->
import React, { useEffect, useState } from "react";

export interface SessionItem {
  sid: string;
  createdAt?: string;
  expiresAt?: string;
}

export default function SessionPanel() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchSessions = () => {
    setLoading(true);
    fetch("/api/auth/session", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const items = (d.sessions ?? []) as unknown[];
        setSessions(items as SessionItem[]);
      })
      .catch((_err: unknown) => {
        console.warn("fetch sessions failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const revoke = (sid: string) => {
    setLoading(true);
    fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ action: "revoke", sid }),
    })
      .then(fetchSessions)
      .catch((_err: unknown) => {
        console.warn("revoke session failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Sessions</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <table className="w-full text-xs text-left text-gray-300">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Created</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s: SessionItem, i) => (
              <tr key={i}>
                <td>{s.sid}</td>
                <td>{s.createdAt}</td>
                <td>{s.expiresAt}</td>
                <td>
                  <button
                    onClick={() => revoke(s.sid)}
                    className="px-2 py-1 bg-red-700 rounded text-white"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/SessionPanel.tsx -->
import React, { useEffect, useState } from "react";

export interface SessionItem {
  sid: string;
  createdAt?: string;
  expiresAt?: string;
}

export default function SessionPanel() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchSessions = () => {
    setLoading(true);
    fetch("/api/auth/session", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const items = (d.sessions ?? []) as unknown[];
        setSessions(items as SessionItem[]);
      })
      .catch((_err: unknown) => {
        console.warn("fetch sessions failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const revoke = (sid: string) => {
    setLoading(true);
    fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ action: "revoke", sid }),
    })
      .then(fetchSessions)
      .catch((_err: unknown) => {
        console.warn("revoke session failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Sessions</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <table className="w-full text-xs text-left text-gray-300">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Created</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s: SessionItem, i) => (
              <tr key={i}>
                <td>{s.sid}</td>
                <td>{s.createdAt}</td>
                <td>{s.expiresAt}</td>
                <td>
                  <button
                    onClick={() => revoke(s.sid)}
                    className="px-2 py-1 bg-red-700 rounded text-white"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/SessionPanel.tsx -->
import React, { useEffect, useState } from "react";

export interface SessionItem {
  sid: string;
  createdAt?: string;
  expiresAt?: string;
}

export default function SessionPanel() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchSessions = () => {
    setLoading(true);
    fetch("/api/auth/session", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const items = (d.sessions ?? []) as unknown[];
        setSessions(items as SessionItem[]);
      })
      .catch((_err: unknown) => {
        console.warn("fetch sessions failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const revoke = (sid: string) => {
    setLoading(true);
    fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ action: "revoke", sid }),
    })
      .then(fetchSessions)
      .catch((_err: unknown) => {
        console.warn("revoke session failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Sessions</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <table className="w-full text-xs text-left text-gray-300">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Created</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s: SessionItem, i) => (
              <tr key={i}>
                <td>{s.sid}</td>
                <td>{s.createdAt}</td>
                <td>{s.expiresAt}</td>
                <td>
                  <button
                    onClick={() => revoke(s.sid)}
                    className="px-2 py-1 bg-red-700 rounded text-white"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/SessionPanel.tsx -->
import React, { useEffect, useState } from "react";

export interface SessionItem {
  sid: string;
  createdAt?: string;
  expiresAt?: string;
}

export default function SessionPanel() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchSessions = () => {
    setLoading(true);
    fetch("/api/auth/session", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const items = (d.sessions ?? []) as unknown[];
        setSessions(items as SessionItem[]);
      })
      .catch((_err: unknown) => {
        console.warn("fetch sessions failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const revoke = (sid: string) => {
    setLoading(true);
    fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ action: "revoke", sid }),
    })
      .then(fetchSessions)
      .catch((_err: unknown) => {
        console.warn("revoke session failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Sessions</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <table className="w-full text-xs text-left text-gray-300">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Created</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s: SessionItem, i) => (
              <tr key={i}>
                <td>{s.sid}</td>
                <td>{s.createdAt}</td>
                <td>{s.expiresAt}</td>
                <td>
                  <button
                    onClick={() => revoke(s.sid)}
                    className="px-2 py-1 bg-red-700 rounded text-white"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/SessionPanel.tsx -->
import React, { useEffect, useState } from "react";

export interface SessionItem {
  sid: string;
  createdAt?: string;
  expiresAt?: string;
}

export default function SessionPanel() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchSessions = () => {
    setLoading(true);
    fetch("/api/auth/session", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const items = (d.sessions ?? []) as unknown[];
        setSessions(items as SessionItem[]);
      })
      .catch((_err: unknown) => {
        console.warn("fetch sessions failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const revoke = (sid: string) => {
    setLoading(true);
    fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ action: "revoke", sid }),
    })
      .then(fetchSessions)
      .catch((_err: unknown) => {
        console.warn("revoke session failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Sessions</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <table className="w-full text-xs text-left text-gray-300">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Created</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s: SessionItem, i) => (
              <tr key={i}>
                <td>{s.sid}</td>
                <td>{s.createdAt}</td>
                <td>{s.expiresAt}</td>
                <td>
                  <button
                    onClick={() => revoke(s.sid)}
                    className="px-2 py-1 bg-red-700 rounded text-white"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/SessionPanel.tsx -->
import React, { useEffect, useState } from "react";

export interface SessionItem {
  sid: string;
  createdAt?: string;
  expiresAt?: string;
}

export default function SessionPanel() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchSessions = () => {
    setLoading(true);
    fetch("/api/auth/session", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const items = (d.sessions ?? []) as unknown[];
        setSessions(items as SessionItem[]);
      })
      .catch((_err: unknown) => {
        console.warn("fetch sessions failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const revoke = (sid: string) => {
    setLoading(true);
    fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ action: "revoke", sid }),
    })
      .then(fetchSessions)
      .catch((_err: unknown) => {
        console.warn("revoke session failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Sessions</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <table className="w-full text-xs text-left text-gray-300">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Created</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s: SessionItem, i) => (
              <tr key={i}>
                <td>{s.sid}</td>
                <td>{s.createdAt}</td>
                <td>{s.expiresAt}</td>
                <td>
                  <button
                    onClick={() => revoke(s.sid)}
                    className="px-2 py-1 bg-red-700 rounded text-white"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
