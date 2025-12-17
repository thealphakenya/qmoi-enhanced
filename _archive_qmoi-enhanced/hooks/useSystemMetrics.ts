import { useState, useEffect } from "react";

export interface SystemMetrics {
  cpu: {
    usage: number;
    temperature: number;
    cores: number;
    load: number[];
  };
  memory: {
    total: number;
    used: number;
    free: number;
    swap: {
      total: number;
      used: number;
      free: number;
    };
  };
  gpu?: {
    usage: number;
    temperature: number;
    memory: {
      total: number;
      used: number;
      free: number;
    };
  };
  disk: {
    total: number;
    used: number;
    free: number;
    iops: number;
    readSpeed: number;
    writeSpeed: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
    connections: number;
  };
  processes: {
    total: number;
    running: number;
    sleeping: number;
    stopped: number;
    zombie: number;
  };
  uptime: number;
  lastUpdate: number;
}

export function useSystemMetrics() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const adminToken = localStorage.getItem("adminToken") || "";
        const response = await fetch("/api/system/metrics", {
          headers: { "x-admin-token": adminToken },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch system metrics");
        }

        const data = await response.json();
        setMetrics(data);
        setError(null);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch metrics",
        );
        console.error("Failed to fetch system metrics:", error);
      }
    }

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const getMetricHistory = async (
    metric: keyof SystemMetrics,
    duration: "1h" | "6h" | "24h" | "7d",
  ) => {
    try {
      const adminToken = localStorage.getItem("adminToken") || "";
      const response = await fetch(
        `/api/system/metrics/history?metric=${metric}&duration=${duration}`,
        {
          headers: { "x-admin-token": adminToken },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch metric history");
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch metric history:", error);
      throw error;
    }
  };

  const getProcessDetails = async (pid: number) => {
    try {
      const adminToken = localStorage.getItem("adminToken") || "";
      const response = await fetch(`/api/system/processes/${pid}`, {
        headers: { "x-admin-token": adminToken },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch process details");
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch process details:", error);
      throw error;
    }
  };

  return {
    metrics,
    error,
    getMetricHistory,
    getProcessDetails,
  };
}
