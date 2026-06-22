"use client";

import { useCallback, useState } from "react";

export interface SessionInfo {
  id: string;
  deviceName: string;
  deviceType: string;
  browser: string;
  os: string;
  ipAddress: string;
  lastActivity: string;
  isActive: boolean;
  isCurrent?: boolean;
}

export function useSessions() {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/sessions", {
        method: "GET",
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to retrieve sessions");
      }
      setSessions(data.sessions || []);
      return data.sessions || [];
    } catch (err: any) {
      setError(err.message || "Unknown error");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const terminateSession = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/auth/sessions/terminate/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to terminate session");
      }
      await getSessions();
      return data;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, [getSessions]);

  const terminateOtherSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/sessions/terminate-others", {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to terminate other sessions");
      }
      await getSessions();
      return data;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, [getSessions]);

  const renameSession = useCallback(async (id: string, label: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/auth/sessions/${id}/rename`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to rename session");
      }
      await getSessions();
      return data;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, [getSessions]);

  return {
    sessions,
    loading,
    error,
    getSessions,
    terminateSession,
    terminateOtherSessions,
    renameSession,
  };
}
