import { useState, useEffect } from "react";

export interface AIHealth {
  status: "healthy" | "degraded" | "critical";
  lastCheck: number;
  error?: string;
  metrics?: {
    cpu: {
      usage: number;
      temperature: number;
      cores: number;
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
    };
    network: {
      bytesIn: number;
      bytesOut: number;
      packetsIn: number;
      packetsOut: number;
    };
  };
}

export function useAIHealthCheck() {
  const [health, setHealth] = useState<AIHealth>({
    status: "healthy",
    lastCheck: Date.now(),
  });

  useEffect(() => {
    async function checkHealth() {
      try {
        const adminToken = localStorage.getItem("adminToken") || "";
        const response = await fetch("/api/ai-health", {
          headers: { "x-admin-token": adminToken },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch health status");
        }

        const data = await response.json();
        setHealth({
          status: data.overall,
          lastCheck: Date.now(),
          metrics: data.metrics,
        });
      } catch (error) {
        setHealth({
          status: "critical",
          lastCheck: Date.now(),
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return health;
}
