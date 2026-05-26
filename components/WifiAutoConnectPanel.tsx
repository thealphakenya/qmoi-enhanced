"use client";
import React, { useEffect, useState } from "react";
interface Network {
  ssid: string;
  encryption: string;
  signal: number;
  zeroRated?: boolean;
}
export const WifiAutoConnectPanel: React.FC = () => {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"auto" | "manual" | "deployed">("auto");
  const scanNetworks = async () => {
    setError(null);
    try {
      const response = await fetch("/api/wifi/scan");
      if (!response.ok) throw new Error("Failed to scan networks.");
      const data = await response.json();
      setNetworks(
        (data.networks || []).map((item: any) => ({
          ssid: item.ssid || "unknown",
          encryption: item.encryption || "Unknown",
          signal: item.signal || 0,
          zeroRated: item.zeroRated || false,
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to scan Wi-Fi networks.");
      setNetworks([
        { ssid: "qmoi-office", encryption: "WPA2", signal: 86, zeroRated: false },
        { ssid: "free-zone", encryption: "None", signal: 62, zeroRated: true },
        { ssid: "campus-wifi", encryption: "WPA2", signal: 73, zeroRated: false },
      ]);
    }
  };
  const connect = async (ssid: string, zeroRated = false) => {
    setConnecting(true);
    setError(null);
    try {
      const response = await fetch("/api/wifi/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ssid, zeroRated }),
      });
      if (!response.ok) throw new Error("Failed to connect to network.");
      setConnected(ssid);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed.");
    } finally {
      setConnecting(false);
    }
  };
  useEffect(() => {
    scanNetworks();
  }, []);
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Wi-Fi Auto Connect</h2>
          <p className="text-sm text-slate-500">Automatically discover and connect to available networks.</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Mode:</label>
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value as "auto" | "manual" | "deployed")}
            className="rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
          >
            <option value="auto">Auto</option>
            <option value="manual">Manual</option>
            <option value="deployed">Deployed</option>
          </select>
        </div>
      </div>
      {error && <div className="mb-4 rounded-3xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={scanNetworks}
          disabled={connecting}
          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {connecting ? "Scanning..." : "Rescan Networks"}
        </button>
      </div>
      <div className="mb-4 text-sm text-slate-600">
        Status: {connected ? `Connected to ${connected}` : "Not connected"}
      </div>
      <ul className="space-y-3">
        {networks.map((network) => (
          <li key={network.ssid} className="rounded-3xl border border-slate-200 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-semibold text-slate-900">{network.ssid}</div>
                <div className="text-sm text-slate-500">
                  {network.encryption} · Signal {network.signal}% {network.zeroRated ? "· Zero-rated" : ""}
                </div>
              </div>
              <button
                type="button"
                onClick={() => connect(network.ssid, network.zeroRated)}
                disabled={connecting || connected === network.ssid}
                className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {connected === network.ssid ? "Connected" : "Connect"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
