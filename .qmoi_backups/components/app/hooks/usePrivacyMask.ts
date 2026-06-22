"use client";

import { useCallback, useState } from "react";

export type PrivacyLevel = "basic" | "full";

export interface PrivacyMaskStatus {
  enabled: boolean;
  level: PrivacyLevel | "none";
  message: string;
}

export function usePrivacyMask() {
  const [status, setStatus] = useState<PrivacyMaskStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enablePrivacyMask = useCallback(async (level: PrivacyLevel) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/privacy-mask/enable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to enable privacy mask");
      }
      return data;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const disablePrivacyMask = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/privacy-mask/disable", {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to disable privacy mask");
      }
      return data;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPrivacyMaskStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/privacy-mask/status", {
        method: "GET",
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to retrieve privacy mask status");
      }
      setStatus(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    status,
    loading,
    error,
    enablePrivacyMask,
    disablePrivacyMask,
    getPrivacyMaskStatus,
  };
}
