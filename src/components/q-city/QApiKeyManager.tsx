"use client";
import React, { useState } from "react";
interface APIKey {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: string;
}
const sampleKeys: APIKey[] = [
  { key: "api_12345", createdAt: "2026-04-12", revoked: false, usage: "320 requests" },
  { key: "api_67890", createdAt: "2026-03-29", revoked: true, usage: "0 requests" },
];
export default function QApiKeyManager() {
  const [keys, setKeys] = useState<APIKey[]>(sampleKeys);
  const revokeKey = (key: string) => {
    setKeys((prev) => prev.map((item) => (item.key === key ? { ...item, revoked: true } : item)));
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
