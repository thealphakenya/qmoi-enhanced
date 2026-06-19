"use client";

import { useCallback, useState } from "react";

export interface BiometricStatus {
  enrolled: boolean;
  methods: Array<{ method: string; enrolled: boolean; enrolledAt: string; lastVerifiedAt?: string }>;
}

export function useBiometric() {
  const [status, setStatus] = useState<BiometricStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBiometricStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/biometric/status", {
        method: "GET",
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Unable to retrieve biometric status");
      }
      const data = await response.json();
      setStatus(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyBiometric = useCallback(async (method: string, rawTemplate: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/biometric/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, templateData: btoa(rawTemplate) }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Biometric verification failed");
      }
      return data;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBiometric = useCallback(async (method: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/auth/biometric/delete/${method}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete biometric method");
      }
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
    getBiometricStatus,
    verifyBiometric,
    deleteBiometric,
  };
}
