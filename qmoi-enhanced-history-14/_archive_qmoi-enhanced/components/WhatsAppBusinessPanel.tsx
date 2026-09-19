import React, { useState, useEffect } from "react";
import { useAuth } from "../src/hooks/useAuth";

export function WhatsAppBusinessPanel() {
  const { user } = useAuth();
  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/whatsapp/audit")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLogs(data.logs);
      });
  }, []);

  const verify = async () => {
    setLoading(true);
    setStatus("");
    const res = await fetch("/api/whatsapp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: user?.email }), // Replace with phone if available
    });
    const data = await res.json();
    setStatus(data.success ? data.result : data.error);
    setLoading(false);
    // Refresh logs
    fetch("/api/whatsapp/audit")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLogs(data.logs);
      });
  };

  if (!user || user.role !== "master") return null;

  return (
    <div>
      <h2>WhatsApp Business Automation (Master Only)</h2>
      <section>
        <h3>Connection Status</h3>
        <div>
          Status: <span>Not Connected</span>
        </div>
        <button disabled={loading} onClick={verify}>
          Verify WhatsApp Account
        </button>
        <div>Status: {status}</div>
      </section>
      <section>
        <h3>Business Settings</h3>
        <button>Manage Ads</button>
        <button>Update Status</button>
        <button>Configure Auto-Reply</button>
      </section>
      <section>
        <h3>Audit Log</h3>
        <div
          style={{
            maxHeight: 120,
            overflow: "auto",
            background: "#f5f5f5",
            padding: 8,
          }}
        >
          {logs.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </section>
    </div>
  );
}
