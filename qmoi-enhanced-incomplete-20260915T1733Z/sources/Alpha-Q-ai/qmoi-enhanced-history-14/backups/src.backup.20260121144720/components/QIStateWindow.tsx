"use client";
import React, { useEffect, useState } from "react";
import { getSessionHeaders } from "../services/qmoiSession";

type StatusResp = {
  status: string;
  last_check?: string;
  mutation_count?: number;
  logs?: string[];
};

export function QIStateWindow() {
  const [data, setData] = useState<StatusResp | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/qmoi/status", { headers: getSessionHeaders() })
      .then((r) => r.json())
      .then((d) => mounted && setData(d))
      .catch((_e) => mounted && setError(String(e)))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Loading QI state…</div>;
  if (error) return <div>Error loading state: {error}</div>;
  if (!data) return <div>No state available</div>;

  return (
    <div
      style={{
        padding: 8,
        borderRadius: 6,
        background: "#0b1220",
        color: "#cfe",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>QMoi State</div>
      <div>Status: {data.status}</div>
      <div>Last check: {data.last_check ?? "—"}</div>
      <div>Mutations: {data.mutation_count ?? 0}</div>
      <div style={{ marginTop: 6 }}>
        <div style={{ fontWeight: 600 }}>Recent logs</div>
        <ul>
          {(data.logs || []).slice(0, 5).map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
