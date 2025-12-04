import React, { useEffect, useState } from "react";

export default function SessionPanel() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchSessions = () => {
    setLoading(true);
    fetch("/api/auth/session", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data) => setSessions(data.sessions || []))
      .catch((e) => setError(e.message))
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
      .catch((e) => setError(e.message))
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
            {sessions.map((s, i) => (
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
