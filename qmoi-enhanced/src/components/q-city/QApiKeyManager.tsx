import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

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
    const res = await fetch("/api/qapikey");
    const data = await res.json();
    setKeys(data.keys || []);
  };

  const fetchUsage = async () => {
    const res = await fetch("/api/qapikey/usage");
    const data = await res.json();
    setUsage(data.usage || []);
  };

  useEffect(() => {
    fetchKeys();
    fetchUsage();
  }, []);

  const createKey = async () => {
    await fetch("/api/qapikey", { method: "POST" });
    fetchKeys();
  };

  const revokeKey = async (key: string) => {
    await fetch("/api/qapikey", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });
    fetchKeys();
  };

  return (
    <Card className="space-y-4 mt-4">
      <CardHeader>
  <Typography variant="h6">Q API Key Manager</Typography>
      </CardHeader>
      <CardContent>
  <Button onClick={createKey} sx={{ mb: 2 }} variant="contained" color="primary">
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
                      size="small"
                      variant="outlined"
                      color="secondary"
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
        {/* TODO: Advanced logging, persistent storage, usage logs */}
      </CardContent>
    </Card>
  );
};

export default QApiKeyManager;
