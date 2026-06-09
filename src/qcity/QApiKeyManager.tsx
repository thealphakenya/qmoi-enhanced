"use client";
import React, { useEffect, useState } from "react";
interface APIKey {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: string;
}
export default function QApiKeyManager() {
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchKeys() {
      try {
        const res = await fetch('/api/qcity/api-keys');
        if (!res.ok) throw new Error(`Failed to fetch API keys: ${res.status}`);
        const json = await res.json();
        if (mounted) setKeys(json.keys || json || []);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchKeys();
    return () => {
      mounted = false;
    };
  }, []);

  const revokeKey = async (key: string) => {
    // Optimistic UI update with server call
    setKeys((prev) => prev.map((item) => (item.key === key ? { ...item, revoked: true } : item)));
    try {
      await fetch('/api/qcity/api-keys/revoke', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) });
    } catch (err) {
      // Revert on error
      setKeys((prev) => prev.map((item) => (item.key === key ? { ...item, revoked: false } : item)));
      setError(err instanceof Error ? err.message : 'Failed to revoke key');
    }
  };
  return (
    <div className="space-y-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">API Key Manager</h2>
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3">Key</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Usage</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((item) => (
              <tr key={item.key} className="border-t border-slate-200">
                <td className="px-4 py-3 break-all">{item.key}</td>
                <td className="px-4 py-3">{item.createdAt}</td>
                <td className="px-4 py-3">{item.usage}</td>
                <td className="px-4 py-3">{item.revoked ? "Revoked" : "Active"}</td>
                <td className="px-4 py-3">
                  {!item.revoked && (
                    <button
                      type="button"
                      onClick={() => revokeKey(item.key)}
                      className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
                    >
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
