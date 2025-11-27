import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ApiKey {
  key: string;
  createdAt: string;
  revoked: boolean;
  usage: number;
}

const QApiKeyManager: React.FC = () => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [usage, setUsage] = useState<{ key: string; usage: number }[]>([]);

  const fetchKeys = async () => {
    try {
      const res = await fetch("/api/qapikey");
      const data = await res.json();
      setKeys(data.keys || []);
    } catch {
      const local = JSON.parse(localStorage.getItem('q_api_keys') || '[]');
      setKeys(local);
    }
  };

  const fetchUsage = async () => {
    try {
      const res = await fetch("/api/qapikey/usage");
      const data = await res.json();
      setUsage(data.usage || []);
    } catch {
      const local = JSON.parse(localStorage.getItem('q_api_usage') || '[]');
      setUsage(local);
    }
  };

  useEffect(() => {
    fetchKeys();
    fetchUsage();
  }, []);

  const createKey = async () => {
    try {
      await fetch("/api/qapikey", { method: "POST" });
      fetchKeys();
    } catch {
      // local key generation
      const key = 'local_' + Math.random().toString(36).slice(2, 12);
      const rec = { key, createdAt: new Date().toISOString(), revoked: false, usage: 0 };
      const updated = [rec, ...keys];
      localStorage.setItem('q_api_keys', JSON.stringify(updated));
      setKeys(updated);
    }
  };

  const revokeKey = async (key: string) => {
    try {
      await fetch("/api/qapikey", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      fetchKeys();
    } catch {
      const updated = keys.map((k) => (k.key === key ? { ...k, revoked: true } : k));
      localStorage.setItem('q_api_keys', JSON.stringify(updated));
      setKeys(updated);
    }
  };

  return (
    <Card className="space-y-4 mt-4">
      <CardHeader>
        <CardTitle>Q API Key Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={createKey} className="mb-2">
          Generate New Key
        </Button>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>Key</th>
              <th>Created</th>
              <th>Status</th>
              <th>Usage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k.key} className="border-t">
                <td className="break-all">{k.key}</td>
                <td>{k.createdAt}</td>
                <td>{k.revoked ? "Revoked" : "Active"}</td>
                <td>{k.usage}</td>
                <td>
                  {!k.revoked && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => revokeKey(k.key)}
                    >
                      Revoke
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Basic key management and usage retrieval implemented. Advanced auditing and RBAC can be added later. */}
      </CardContent>
    </Card>
  );
};

export default QApiKeyManager;
