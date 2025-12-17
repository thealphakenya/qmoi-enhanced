import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Network {
  ssid: string;
  encryption: string;
  signal: number;
  connected?: boolean;
  zeroRated?: boolean;
}

type ConnectionMode = "auto" | "manual" | "scheduled";

export const WifiAutoConnectPanel: React.FC = () => {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ConnectionMode>("auto");
  const { toast } = useToast();

  // Connect to a network
  const connect = async (ssid: string, isZeroRated = false) => {
    setConnecting(true);
    setError(null);
    try {
      const res = await fetch("/api/wifi/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ssid, isZeroRated }),
      });

      if (!res.ok) throw new Error("Failed to connect");

      setConnected(ssid);
      toast({
        title: "Connected",
        description: `Successfully connected to ${ssid}`,
      });
    } catch (e) {
      const error = e as Error;
      setError(error.message);
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    }
    setConnecting(false);
  };

  // Scan for available networks
  const scanNetworks = async () => {
    setConnecting(true);
    setError(null);
    try {
      const res = await fetch("/api/wifi/scan");
      if (!res.ok) throw new Error("Failed to scan networks");
      const data = await res.json();
      setNetworks(
        data.networks.map((net: any) => ({
          ...net,
          encryption: net.secure ? "WPA2" : "None",
          zeroRated: false, // This would be determined by your zero-rated network detection logic
        })),
      );
    } catch (e) {
      const error = e as Error;
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    setConnecting(false);
  };

  // Auto-connect logic
  useEffect(() => {
    scanNetworks();
  }, []);

  useEffect(() => {
    if (networks.length > 0 && !connected) {
      const wifi = networks.find(
        (n) => n.encryption === "WPA2" && !n.zeroRated,
      );
      const zero = networks.find((n) => n.zeroRated);
      if (mode === "auto" && wifi) connect(wifi.ssid);
      else if (mode === "scheduled" && zero) connect(zero.ssid, true);
    }
  }, [networks, mode, connected, connect]);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">
        WiFi & Zero-Rated Auto-Connect
      </h3>
      <div className="mb-4">
        <label className="font-medium">Mode:</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as ConnectionMode)}
          className="ml-2 p-1 border rounded"
        >
          <option value="auto">Auto</option>
          <option value="manual">Manual</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>
      <button
        onClick={scanNetworks}
        disabled={connecting}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {connecting ? "Scanning..." : "Rescan Networks"}
      </button>
      <div className="mb-4">
        <span className="font-medium">Status:</span>{" "}
        {connected ? `Connected to ${connected}` : "Not connected"}
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <ul className="space-y-2">
        {networks.map((network) => (
          <li
            key={network.ssid}
            className="flex items-center justify-between p-2 border rounded"
          >
            <div>
              <span className="font-medium">{network.ssid}</span>
              {network.zeroRated && (
                <span className="ml-2 text-green-600">(Zero-Rated)</span>
              )}
              <span
                className={`ml-2 ${network.encryption === "WPA2" ? "text-green-600" : "text-red-600"}`}
              >
                {network.encryption === "WPA2" ? "Secured" : "Unsecured"}
              </span>
              <span className="ml-2">Signal: {network.signal}%</span>
            </div>
            <button
              onClick={() => connect(network.ssid, network.zeroRated)}
              disabled={connecting || connected === network.ssid}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {connected === network.ssid ? "Connected" : "Connect"}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-sm text-gray-500">
        Prioritizes WiFi auto-connect, then zero-rated (free) internet if WiFi
        is unavailable. Uses minimal data when not on WiFi.
      </div>
    </div>
  );
};
