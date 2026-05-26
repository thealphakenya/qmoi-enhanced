"use client";
import React, { useEffect, useState } from "react";
interface WifiNetwork {
  ssid: string;
  signal: number;
  secure: boolean;
  connected: boolean;
}
interface WifiPanelProps {
  onClose?: () => void;
}
const defaultNetworks: WifiNetwork[] = [
  { ssid: "qmoi-office", signal: 86, secure: true, connected: false },
  { ssid: "campus-free", signal: 73, secure: false, connected: false },
  { ssid: "community-hub", signal: 92, secure: true, connected: true },
];
export default function WifiPanel({ onClose }: WifiPanelProps) {
  const [networks, setNetworks] = useState<WifiNetwork[]>(defaultNetworks);
  const [loading, setLoading] = useState(false);
  const [autoConnect, setAutoConnect] = useState(true);
  const [connected, setConnected] = useState<string | null>("community-hub");
  const [error, setError] = useState<string | null>(null);
  const scanNetworks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/wifi/scan");
      if (!response.ok) throw new Error("Failed to scan networks.");
      const data = await response.json();
      setNetworks(data.networks || defaultNetworks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to scan Wi-Fi networks.");
      setNetworks(defaultNetworks);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    scanNetworks();
  }, []);
  useEffect(() => {
    if (autoConnect && networks.length > 0 && !connected) {
      const available = networks.find((network) => network.secure) || networks[0];
      if (available) {
        setConnected(available.ssid);
      }
    }
  }, [autoConnect, connected, networks]);
  const connect = (ssid: string) => {
    setConnected(ssid);
    setNetworks((prev) =>
      prev.map((network) => ({
        ...network,
        connected: network.ssid === ssid,
      })),
    );
  };
  return (
    <div className="space-y-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">WiFi Manager</h2>
          <p className="text-sm text-slate-500">Manage scanning and connection behavior for Wi-Fi networks.</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Close
        </button>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={scanNetworks}
          disabled={loading}
          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Scanning..." : "Rescan"}
        </button>
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={autoConnect}
            onChange={(event) => setAutoConnect(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-slate-900"
          />
          Auto-connect
        </label>
      </div>
      {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
      <div className="grid gap-4">
        {networks.map((network) => (
          <div key={network.ssid} className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-semibold text-slate-900">{network.ssid}</div>
              <div className="text-sm text-slate-500">{network.secure ? "Secured" : "Open"} · Signal {network.signal}%</div>
            </div>
            <button
              type="button"
              onClick={() => connect(network.ssid)}
              className={`rounded-2xl px-4 py-2 text-sm font-semibold text-white ${network.connected ? "bg-emerald-600" : "bg-slate-900"}`}
            >
              {network.connected ? "Connected" : "Connect"}
            </button>
          </div>
        ))}
      </div>
      <div className="rounded-3xl border border-slate-200 bg-slate-100 p-4 text-sm text-slate-700">
        {connected ? `Connected to ${connected}` : "No network selected."}
      </div>
    </div>
  );
}
