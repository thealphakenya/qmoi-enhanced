"use client";

import { useCallback, useState } from "react";

export interface ConsciousnessMetrics {
  awareness: number;
  totalInteractions: number;
  memorySize: number;
  decisionsRecorded: number;
  lastSyncAge: number;
}

export function useConsciousness() {
  const [metrics, setMetrics] = useState<ConsciousnessMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recordAction = useCallback(async (action: string, details: Record<string, any> = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/consciousness/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, details }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to record consciousness action");
      }
      return data;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/consciousness/metrics", {
        method: "GET",
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to retrieve consciousness metrics");
      }
      setMetrics(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    metrics,
    loading,
    error,
    recordAction,
    fetchMetrics,
  };
}
