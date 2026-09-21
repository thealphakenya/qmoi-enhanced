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
        <Button
          onClick={createKey}
          sx={{ mb: 2 }}
          variant="contained"
          color="primary"
        >
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
        <div
          style={{
            marginTop: 12,
            padding: 12,
            background: "#f8fafc",
            borderRadius: 8,
          }}
        >
          <p style={{ margin: 0, color: "#334155" }}>
            Advanced logging, persistent storage and detailed usage analytics
            are available in the full deployment. Use the button below to open a
            usage placeholder.
          </p>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={() => alert("Open API key usage logs (placeholder)")}
            style={{ marginTop: 8 }}
          >
            View Usage Logs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QApiKeyManager;

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.826047Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:32.974842Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.351665Z
